# 02 · Funcionalidades del POC

Lo que sigue está implementado y se probó en el browser. `pnpm smoke` verifica las reglas del motor.

## Pantallas

| Pantalla | Ruta | Qué hace |
|---|---|---|
| **Reportes** | `#/` | Lista de Report Templates: dominio, tipo de salida, programación, modo de grano y último run. También muestra los últimos Report Runs y el diagrama Template → Ad-hoc / Scheduled → Run. Permite crear un reporte eligiendo el dominio de partida, duplicarlo, eliminarlo y restaurar los ejemplos. |
| **Builder** | `#/builder/:id` | Arma y edita un template, con vista previa en vivo. |
| **Viewer** | `#/view/:id[/run/:runId]` | Pide los parámetros, ejecuta, muestra el run y su historial, y exporta a CSV. |
| **Modelo Silver** | `#/model` | Las tablas propuestas, el linaje de cada columna y las brechas encontradas en los repos. |

## Builder

### Catálogo de campos (panel izquierdo)

- **Cuatro dominios** de partida: Financial Events, Accounts, Reconciliation Workflows y Tagging.
- Dentro de cada dominio, un **árbol de entidades** padre → hijo. Los subtipos (Internal Payin, Internal Payout, Bank Movement) aparecen colgando de Financial Events.
- Cada entidad muestra un punto que indica de dónde saldrían sus datos:
  - 🟢 se pueden derivar hoy desde eventos;
  - 🟡 necesitan una fuente nueva.
- La ⓘ de cada entidad muestra su tabla Silver, su tipo de relación y una descripción.
- Hay dos tipos de campo:
  - **dimensión** (azul): texto, categoría, fecha, número o booleano;
  - **medida** (verde, Σ): un número que se agrega. Los saldos llevan la marca "semi".
- **Entidades relacionadas:** de cualquier dominio se pueden sumar campos de otras entidades con las que haya un JOIN posible.
- **Campos calculados:** se crean, editan y borran desde el mismo panel.
- Búsqueda por nombre de campo.
- Se agrega un campo **arrastrándolo** o con los botones **+** (a Dimensiones o Medidas) y **⏷** (a Filtros).

### Shelves

| Shelf | Acepta | Notas |
|---|---|---|
| **Dimensiones** | Dimensiones y fórmulas por fila | Una medida soltada acá se redirige a Medidas, con aviso. |
| **Medidas** | Medidas, fórmulas y dimensiones | Una dimensión soltada acá se convierte en `COUNTD`. |
| **Filtros** | Cualquier campo | Global. Un filtro sobre una fórmula de agregación se aplica después de agregar (`HAVING`). |
| **Fila de JOIN** (t1, t2…) | Cualquier campo | Filtra **solo** ese JOIN. Se renombra desde el título y se elimina con el tacho: sus medidas vuelven al JOIN principal. |
| **Parámetros** | — | Crear, renombrar, elegir tipo (fecha, número o texto) y el valor por defecto, fijo o relativo. |

Los chips se reordenan arrastrando y se mueven entre shelves.

**Opciones de una columna** (click en el chip):

- **Etiqueta:** admite `{Parámetro}`.
- **Agregación:**
  - Suma, Promedio, Mín, Máx, Cantidad, Cantidad distinta, Último por fecha.
  - En los saldos, el panel explica por qué conviene "Último".
- **Granularidad de fecha:** exacta, día, semana, mes, trimestre, año.
- **Orden:** ascendente o descendente.
- **JOIN:** principal, uno existente o **+ Nuevo JOIN**.
- **Comparar con…:** agrega columnas Δ y Δ% contra otra medida.

### Diálogos que aparecen solos

| Diálogo | Cuándo | Opciones |
|---|---|---|
| **¿Cómo querés agrupar?** | Al combinar un padre con un hijo, una vez por combinación | Resumir por padre, Jerárquico o Detalle por hijo, cada una con el conteo real de filas que daría |
| **¿Mismo JOIN o nuevo JOIN?** | Al agregar una medida de una tabla que ya está en el reporte | Mismo JOIN (principal o t*n*), o Nuevo JOIN. Si las medidas existentes estaban en el principal, pasan a t1 y la nueva va a t2. |

### Avisos y explicaciones

- La **banda de padre/hijo** muestra el modo actual y permite cambiarlo en el momento.
- En **rojo** aparece lo que se ignoró o que daría mal:
  - un campo del hijo en modo "Resumir por padre";
  - una dimensión que no existe en todos los JOINs;
  - una suma de monedas distintas dentro de una misma fila.
- En **azul** aparece lo que el motor hizo solo:
  - agregar el filtro por tipo (subtipo);
  - resolver un drill-across o un M:N;
  - convertir un filtro en semi-join;
  - ocultar totales por mezcla de monedas.

### Vista previa

- La barra de salida permite elegir entre Tabla, Pivot, Barras, Apiladas, Líneas, Área, Torta y KPI.
- Según la salida aparecen opciones extra: eje X o porciones, series (una dimensión o las medidas), columnas del pivot, totales y límite de filas.
- Tres pestañas:
  - **Vista previa;**
  - **SQL sobre Silver:** la query que correría, con CTE por JOIN y `:parametros`;
  - **Definición:** el JSON del template.
- También muestra el grano resultante, cuántas filas devolvió, cuántas leyó y en cuántos milisegundos.

### Programar

Frecuencia diaria, semanal o mensual, con hora, destinatarios y formato de entrega (PDF, Excel, CSV o link). Muestra las próximas 3 ejecuciones. Se puede **simular** una ejecución programada, que queda como un Run con disparo "programado".

## Viewer

- **Parámetros del reporte:** para las fechas hay un date picker y un selector relativo. Los **filtros expuestos** se muestran como controles.
- **Ejecutar** crea un Report Run ad-hoc con los valores elegidos.
- Cada run muestra:
  - su id y cómo se disparó (ad-hoc o programado);
  - cuándo se ejecutó, cuánto tardó y quién lo corrió;
  - cuántas filas dio y con qué grano;
  - los parámetros con su valor resuelto y los filtros.
- **Historial de runs** en el costado. Un run se ve con **su** snapshot. Si el template cambió después, el Viewer lo avisa.
- **Cómo se calculó:** los mismos avisos del Builder.
- **Exportar CSV.**

## Tipos de salida

| Salida | Detalle |
|---|---|
| **Tabla** | Plana o jerárquica (grupos desplegables con subtotales). Ordenable por columna, con fila de totales. Los negativos se muestran en rojo. Carga de a 300 filas o más. |
| **Pivot** | Filas × una dimensión en columnas × medidas. Los totales de fila, de columna y el general **se re-consultan** en su grano, así que funcionan con promedios, COUNTD y saldos. |
| **Barras / Apiladas** | Pasan a horizontales si hay más de 8 categorías que no son fechas. |
| **Líneas / Área** | Crosshair y tooltip. |
| **Torta** | Hasta 6 porciones más "Otros". Los negativos se muestran en valor absoluto, con aviso. |
| **KPI** | Una tarjeta por medida, con el total del período filtrado. |

Detalles de los gráficos:
- Paleta categórica validada, con 8 colores en orden fijo. El color sigue a la entidad, no al ranking.
- Desde la serie 9 se agrupan en "Otros".
- Leyenda y tooltip siempre.
- Si el gráfico muestra menos dimensiones que el resultado, se re-consulta en su grano.

## Filtros

| Tipo de campo | Operadores |
|---|---|
| Fecha | últimos N días, entre, ≥, ≤, vacío, no vacío |
| Categoría | es uno de (con búsqueda de valores), no es, =, ≠, vacío, no vacío |
| Número o monto | ≥, ≤, >, <, entre, =, ≠, vacío, no vacío |
| Booleano | = Sí / No |
| Texto | contiene, =, ≠, es uno de, vacío, no vacío |

- En los operadores de un valor y en "entre", **cualquier valor puede ser fijo o ligado a un parámetro**. Desde ese mismo selector se puede crear un parámetro nuevo.
- Un filtro sobre una entidad **hija** del grano se aplica como **semi-join**: "que tenga al menos uno".
- Un filtro sobre un **hermano** se aplica a través del padre común.

## Parámetros

- Pueden ser de tipo fecha, número o texto.
- Los defaults relativos se resuelven cada vez que se ejecuta. Opciones: hoy, ayer, inicio de mes, fin de mes, inicio del mes anterior, fin del mes anterior, inicio de año, fin del año anterior.
- Se usan en tres lugares:
  - como valores de filtros, globales o de un JOIN;
  - en las etiquetas de columna y en la descripción, como `{Nombre}`;
  - en el SQL, como `:nombre`.

## Fórmulas

**Referencias:**
- `[entidad.campo]` para un campo, por ejemplo `[account_balance.balance_base]`.
- `[Nombre de otra fórmula]` para otra fórmula.
- `[@Columna]` para una columna del reporte, por su etiqueta o su id.

**Operadores:** `+ - * / %`, `= != <> < > <= >=`, `AND OR NOT`. El texto va entre comillas.

**Funciones:**

| Función | Qué hace |
|---|---|
| `SUM` `AVG` `MIN` `MAX` | Agregaciones clásicas |
| `COUNT` `COUNTD` | Cantidad y cantidad de distintos |
| `LAST` `FIRST` | Por fecha de la entidad |
| `IF(c, a, b)` `COALESCE(...)` | Condicional y primer no nulo |
| `ABS` `ROUND(x, n)` | Valor absoluto y redondeo |
| `DIV(a, b)` | División que da null si b = 0 |
| `DATEDIFF(d1, d2)` `YEAR` `MONTH` | Fechas |
| `CONCAT` `UPPER` `LOWER` `CONTAINS` | Texto |

El editor ayuda a escribir y validar:
- valida mientras escribís y detecta si la fórmula es **por fila, de agregación o entre columnas**;
- muestra un valor de ejemplo con los filtros actuales;
- permite insertar campos, fórmulas y columnas con un click;
- el formato puede ser número, moneda, porcentaje o texto.

## Comportamientos automáticos del motor

| Situación | Qué hace |
|---|---|
| Se usan campos de un subtipo | Agrega `type ∈ {…}` |
| Se combinan padre + hijo | Pregunta el grano: parent, nested o child |
| Se combinan hermanos | Drill-across, sin fan-out |
| La medida está en un JOIN propio | Agregación independiente con sus filtros, unida por las dimensiones |
| Dos entidades sin padre común | Busca el bridge M:N y usa agregado simétrico |
| Una medida del padre en el grano del hijo | Agregado simétrico: una vez por padre |
| Saldo con "Último" | Toma el último por cuenta dentro del filtro y suma entre cuentas |
| Monto en moneda original | Avisa si una fila mezcla monedas y oculta el total si el total las mezcla |
| Una fórmula referencia otra | Hereda su tipo: agregación o entre columnas |

## Reportes de ejemplo

| Template | Qué demuestra |
|---|---|
| Comparación de cierre de caja | 3 JOINs (Balances ×2 + Transactions), parámetros relativos, etiquetas interpoladas, fórmulas entre columnas y un control de "diferencia no explicada" |
| Egresos: mes actual vs anterior | La misma tabla en 2 JOINs, agrupada por un campo propio (contraparte), con Δ% |
| Posición de caja por banco | Semi-aditivo, resumen por padre, barras apiladas |
| Flujo mensual cobros vs pagos | Fórmulas de agregación que se referencian entre sí |
| Payins por PSP y canal de venta | Subtipo (filtro automático), pivot con totales re-consultados |
| Saldo vs movimientos por cuenta | Hermanos (drill-across), total oculto por monedas |
| Conciliaciones por workflow | Modo jerárquico, % de diferencia |
| Egresos por grupo de tags | M:N vía bridge, total deduplicado |
| Movimientos sin conciliar | Detalle por hijo, fórmula por fila como dimensión (antigüedad), filtro expuesto |
| KPIs de conciliación | Salida KPI, tasa calculada |
| Evolución de saldo por moneda | Área apilada semanal con saldo semi-aditivo |
