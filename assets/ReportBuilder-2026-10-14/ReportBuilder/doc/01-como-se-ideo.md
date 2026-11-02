# 01 · Cómo se ideó

## El pedido

Queremos que un usuario de tesorería arme sus propios reportes sin pedirle una query a nadie. Tiene que poder:

- elegir columnas;
- combinar datos de distintos módulos: eventos financieros, cuentas, conciliación y tags;
- filtrar y calcular;
- ver el resultado como tabla o como gráfico.

El reporte se ejecuta ad-hoc o programado, y cada ejecución queda registrada.

La idea salió de un diagrama con dos piezas:

```
Report Template ──(Ad-hoc | Scheduled)──▶ Report Run
```

Esas dos piezas corren sobre cuatro dominios con jerarquías padre → hijo:

- **Financial Events**
- **Accounts**, con Balances y Transactions como hijos
- **Reconciliation Workflows**, con Conciliations y Movements como hijos
- **Tagging**, con Groups y Tags como hijos

Los datos salen de Silver, en th_datalake, desnormalizados en dimensiones.

## Qué encontramos en los repos (relevamiento del 28-09-2026)

Antes de diseñar, relevamos las entidades reales de th_event_core_library, th_datalake, th_ingestion, th_saas, th_reconcilation_module, th_core_reporting y th_webapp. Lo que cambió el diseño:

| Hallazgo | Consecuencia |
|---|---|
| El único que publica eventos es th_ingestion, y solo `FinancialEventCreated` y `FinancialEventUpdated`. | Cuentas, saldos de saas, transacciones de saas, conciliación y tags **no llegan al lake**. **Decidido:** th_saas y conciliación adoptan el **Outbox transaccional de EventCore** y publican eventos de estado. |
| Payin, Payout, Bank Movement y Balance no son eventos: son **tipos** (`Type`) del mismo evento, cada uno con un payload distinto. | En el modelo son **subtipos**: la misma fila con otras columnas. Usar un campo de Payin filtra por tipo, no agrega un JOIN. |
| Los **Tag Groups no existen**. Los Tags de saas son planos, y los tags de conciliación son solo el texto del nombre del filtro. | El diagrama los marcaba en blanco, o sea todavía sin fuente. **Decidido:** los aporta un **módulo nuevo de Tagging**. |
| Las claves no coinciden entre sistemas: el tenant es uuid, long o int según el sistema, y `event.account_uuid` apunta a `Accounts.Uuid`, no a `Accounts.Id`. | Silver unifica todo por **uuid**. Es trabajo explícito, no un JOIN directo. |
| `Amount` viene sin signo, con `IsNegative` aparte. Conciliation y Balance no tienen moneda. | Silver agrega `amount_signed`, deriva la moneda y calcula `amount_base` en USD. El Builder tiene que evitar que se sumen monedas distintas. |
| Los saldos son **semi-aditivos**: se suman entre cuentas, pero no en el tiempo. | Toda medida de saldo usa "último valor por cuenta" y después suma. |
| El diseño de captura rechazó consultar Silver con DuckDB desde la API, por latencia y concurrencia. | El Report Builder real compila a **SQL sobre PostgreSQL de serving**. No lee parquet en cada request. |
| Hay dos despliegues independientes, Azure y on-premise, sin servicios gestionados de Azure. | Todo componente nuevo es un worker .NET que corre en los dos lados. |
| th_core_reporting ya es la API de reporting single-tenant (Dapper, réplica, `ITenantScopedQuery`). th_ai_orchestrator ya implementa "intención en lenguaje natural → propuesta de payload validada". | Ahí van el motor de reportes y el agente AI. No hacen falta servicios nuevos. |

## Los problemas de fondo, y cómo los resuelve el diseño

Un report builder "de columnas" parece simple hasta que se combinan tablas. Los problemas reales son de **grano**, o sea cuántas filas representa cada fila del resultado.

### 1. Padre + hijo: ¿cómo agrupo?

Si combino Account (1 fila) con Balances (N filas por cuenta), el resultado puede ser tres cosas distintas, y ninguna es la correcta por defecto:

| Modo | Resultado | Cuándo sirve |
|---|---|---|
| **Resumir por padre** | 1 fila por cuenta; las medidas del hijo se agregan hacia arriba | Posición de caja |
| **Jerárquico** | Cuenta con subtotales, desplegable a sus hijos | Conciliaciones por workflow y estado |
| **Detalle por hijo** | 1 fila por hijo, con los atributos del padre repetidos | Movimientos sin conciliar |

**Decisión:** el Builder **detecta** la combinación padre/hijo y **pregunta**, mostrando cuántas filas daría cada opción. La respuesta queda guardada en el template (`grain`) y se vuelve a preguntar solo si cambia la combinación de tablas.

**Descartado:**
- Elegir un modo por defecto en silencio. Así nacen los reportes que "dan mal" sin que nadie lo note.
- Obligar al usuario a elegir el grano antes de empezar. Frena la exploración.

### 2. Hermanos: el fan-out

Balances y Transactions son hijos de Account. Un JOIN ingenuo multiplica cada saldo por cada transacción de la cuenta. Este es el error clásico de los report builders, conocido como *chasm trap*.

**Decisión:** se hace **drill-across**. Cada hermano se agrega por separado a las dimensiones del reporte y después se unen los resultados con `FULL OUTER JOIN`. Si un hermano no tiene la dimensión, esa dimensión no se puede usar para agrupar, y el Builder lo avisa.

### 3. Muchos a muchos: los tags

Una transacción puede tener varios tags. Si reporto por grupo de tags, la transacción tiene que contar en cada grupo, pero una sola vez en el total.

**Decisión:** el M:N se resuelve con un **bridge**, `brg_tag_assignment`, que el motor encuentra solo. Las medidas se calculan con un **agregado simétrico**, deduplicado por la clave de origen. Lo mismo vale para una medida del padre vista en el grano del hijo: se cuenta una vez por padre.

### 4. La misma tabla dos veces: t1 vs t2

"Saldo al 01/09 vs saldo al 30/09" usa **la misma tabla con dos filtros distintos**. Un filtro global no alcanza, porque se aplicaría a las dos columnas.

**Decisión: JOIN contexts.** Cuando agregás una medida de una tabla que ya está en el reporte, el Builder pregunta **¿mismo JOIN o nuevo JOIN?**.
- Un JOIN nuevo (t1, t2…) es otra instancia de la tabla, con filtros propios.
- Para el motor, cada JOIN es un "hermano" más. Reusa el drill-across, así que no hace falta un mecanismo nuevo.

**Descartado:**
- Medidas filtradas sueltas, como hace Looker con los *filtered measures*. Resuelven una columna, pero no un grupo de columnas que comparten filtro, por ejemplo saldo y cantidad de t2.
- Obligar a duplicar el Data Set a mano.

### 5. Fechas que se definen al ejecutar

Un reporte programado de "cierre del mes" no puede tener fechas fijas.

**Decisión: parámetros del reporte.**
- Son variables con nombre y un valor por defecto, fijo o relativo: inicio o fin de mes, mes anterior, hoy…
- Cualquier valor de filtro puede ligarse a un parámetro, sea un filtro global o de un JOIN.
- Los títulos de columna pueden interpolarlos: `Saldo al {Desde}`.
- El Viewer los pide al ejecutar, y el Run guarda el valor resuelto.

### 6. Las fórmulas: ¿cuándo se calculan?

Una fórmula puede calcularse en tres momentos distintos, y mezclarlos da resultados incorrectos:

| Tipo | Ejemplo | Se evalúa |
|---|---|---|
| Por fila | `IF([days_open] > 7, "> 7 días", "0–7")` | Antes de agregar, sobre cada fila; puede usarse como dimensión |
| De agregación | `DIV(SUM([diff]), SUM([total]))` | Por grupo; un promedio de porcentajes sería incorrecto |
| Entre columnas | `[@Saldo al {Hasta}] - [@Saldo al {Desde}]` | Sobre el resultado ya agregado; es la única forma de cruzar JOINs distintos |

El motor **clasifica cada fórmula sola** a partir de su AST: si usa funciones de agregación o si referencia columnas con `@`. Una fórmula que usa otra hereda su tipo.

### 7. Totales que no mienten

El total de un promedio no es la suma de los promedios. Tampoco lo es el total de un conteo de distintos (COUNTD) o de un saldo.

**Decisión:** los totales, los subtotales de pivot y los gráficos que muestran menos dimensiones que el resultado **se re-consultan en su propio grano**. Nunca se suman desde las celdas. En SQL esto se hace con `GROUPING SETS` o `ROLLUP`.

**Guardas de tesorería:**
- Si una fila mezcla monedas originales, el Builder avisa.
- Si es el total el que las mezcla, lo oculta.

### 8. Template vs Run

- El **Template** es la definición.
- El **Run** es una ejecución: guarda un snapshot congelado del template, los filtros y parámetros usados, quién la disparó (manual o programada), cuánto tardó y cuántas filas dio.

Editar el template no cambia el historial. El Viewer avisa si un run se hizo con una versión anterior.

## Principios que guiaron todo

1. **Nunca un número incorrecto en silencio.** Ante una ambigüedad (grano, monedas, M:N), el Builder pregunta o explica en "Cómo se calculó", nunca adivina.
2. **Lo difícil vive en el modelo semántico, no en el usuario.** El usuario elige campos; el catálogo sabe quién es padre de quién, qué es subtipo, qué es semi-aditivo y qué campo lleva la moneda.
3. **El SQL es visible.** Cada reporte muestra la query que correría contra Silver. Eso sirve para auditar, para debuggear y para que los desarrolladores confíen en el motor.
4. **Un solo mecanismo para varios casos.** Hermanos, JOIN contexts y bridges son todos "scopes" que se agregan por separado y se unen. Así el motor queda chico y verificable.
5. **Single-tenant siempre.** Toda query lleva `tenant_id`. Es una regla de th_core_reporting que no se negocia.

## Qué NO resuelve el POC (a propósito)

- **No tiene backend:** el motor corre en el browser sobre ~25k filas mock deterministas.
- **El Run no guarda su resultado:** lo recalcula al abrirlo. El real tiene que guardarlo.
- **No hay permisos por Data Set ni por campo,** ni enmascaramiento de datos personales como nombres de pagadores. La política propuesta está en [05](05-definiciones-po-ceo.md), a validar por el PO.
- **El scheduler está simulado** y **no hay PDF**.
- **No hay dashboards** con varios reportes en una misma página.
