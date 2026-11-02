# 05 · Definiciones de PO / CEO

Este documento junta las **decisiones de negocio y de producto** que el Report Builder necesita para avanzar. Cada definición trae una **propuesta concreta** para que el PO o el CEO la valide, la ajuste o la rechace. El equipo técnico no avanza sobre una definición hasta que figura como validada.

**Estados:** ⏳ Pendiente de validación · ✏️ Validada con cambios · ✅ Validada · ❌ Rechazada

**Cómo validar:** completar la línea **Validación** de cada definición con estado, nombre, fecha y comentarios. Si la propuesta cambia, se ajusta el texto y se deja registrado qué cambió.

## Resumen

| # | Definición | Decide | Estado | Bloquea | Se necesita para |
|---|---|---|---|---|---|
| [DEF-1](#def-1--política-de-datos-personales-pii) | Política de datos personales (PII) | **PO** (con revisión legal) | ⏳ | Enmascaramiento, exportaciones, envíos, agente AI | **R1** |
| [DEF-2](#def-2--moneda-de-reporte) | Moneda de reporte | PO | ⏳ | Montos en USD de Silver | R2 |
| [DEF-3](#def-3--frescura-de-los-datos) | Frescura de los datos ("datos al …") | PO | ⏳ | Frecuencia de Silver, scheduler | R1 |
| [DEF-4](#def-4--retención-de-runs-y-exportaciones) | Retención de runs y exportaciones | PO | ⏳ | Almacenamiento de runs | R1 |
| [DEF-5](#def-5--permisos-por-data-set) | Permisos por Data Set y roles | PO | ⏳ | Catálogo, Builder, Viewer | R1 |
| [DEF-6](#def-6--envíos-programados) | Reglas de envíos programados | PO | ⏳ | Scheduler | R4 |
| [DEF-7](#def-7--modelo-de-tag-groups) | Modelo funcional de Tag Groups | PO | ⏳ | Módulo nuevo de Tagging | R3 |
| [DEF-8](#def-8--agente-ai-datos-y-proveedor) | Agente AI: qué datos ve y con qué proveedor | **CEO** | ⏳ | Agente AI | R6 |
| [DEF-9](#def-9--alcance-comercial-y-prioridades) | Alcance comercial y orden de releases | **CEO** | ⏳ | Plan completo | Antes de empezar |

### Ya decidido (registro)

| Tema | Decisión | Fecha |
|---|---|---|
| Cómo llegan th_saas y conciliación al lake | **Patrón Outbox** (EventCore) en cada servicio | 29-09-2026 |
| Tag Groups | Los aporta un **módulo nuevo de Tagging** | 29-09-2026 |
| Dónde viven templates, runs y programaciones | th_core_reporting (**a confirmar** cuando se plantee con el equipo) | 29-09-2026 |
| Frecuencia mínima de un envío programado | **Diaria** | 28-09-2026 |

---

## DEF-1 · Política de datos personales (PII)

**Decide:** PO. **Recomendado:** revisión legal antes de dar la política por cerrada. Esta propuesta **no es asesoramiento legal**.

### Por qué hace falta

El Report Builder deja que cualquier usuario con acceso cruce datos libremente, y parte de esos datos son de **personas que no son el cliente**: pagadores de un payin, beneficiarios de un pago, deudores y acreedores de un movimiento bancario. Sin una política, un reporte agrupado "por pagador", exportado a CSV y enviado por mail todos los días sería una fuga de datos personales programada.

### Propuesta: clasificación de campos

Cada campo del catálogo lleva una clase. La clase la asigna el equipo de datos cuando agrega el campo, y se revisa en el PR.

| Clase | Qué es | Ejemplos en nuestros datos |
|---|---|---|
| **P0 · Operativo** | Datos del negocio del cliente, sin personas identificables | Montos, fechas, estados, monedas, tipos, bancos, empresas y cuentas **propias** del tenant, PSPs, reglas de conciliación |
| **P1 · Identificador financiero propio** | Identificadores de cuentas del propio cliente | Número de cuenta propio, IBAN, CBU o CLABE propios |
| **P2 · Dato personal de terceros** | Identifica o puede identificar a una persona física | Nombre de pagador, beneficiario, deudor o acreedor; contraparte persona física; **textos libres** (descripción del movimiento, *remittance information*), porque suelen traer nombres |
| **P3 · Dato personal sensible o identificador fuerte** | Permite identificar sin dudas o cometer fraude | Documento (DNI, CURP, CPF, RUT, SSN), cuenta bancaria de terceros, email, teléfono, dirección, identificación fiscal de personas físicas |

Los datos de los **usuarios** de la plataforma (quién ejecutó un reporte, destinatarios de envíos) no son datos del reporte. Se rigen por la política general de la plataforma.

### Propuesta: tratamiento por clase

| | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| **¿Llega a la base de reportes?** | Sí | Sí | Sí, con una columna seudónima al lado | **No.** Se queda en el lake (bronze), fuera del alcance de reportes |
| **Builder y Viewer, sin permiso** | Visible | Enmascarado: `****1234` | **Seudónimo estable**, por ejemplo `Pagador #4F2A` | No disponible |
| **Builder y Viewer, con permiso** | Visible | Visible | Visible | No disponible |
| **Agrupar o filtrar sin permiso** | Sí | Sí, por el valor enmascarado | Agrupa por el seudónimo; **no** se puede filtrar por texto sobre el valor real, para que no se pueda inferir | — |
| **Exportación CSV o XLSX** | Sí | Según el permiso de quien exporta | Según el permiso de quien exporta, y queda auditado | — |
| **Envío programado a usuarios del tenant** | Sí | Según el permiso del **destinatario** | Solo si **todos** los destinatarios tienen el permiso; si no, se envía el link al Viewer | — |
| **Envío programado a emails externos** | Sí (si DEF-6 lo permite) | Enmascarado | **Nunca**: se envía seudónimo o solo el link | — |
| **Agente AI** | Sí | Enmascarado | **Nunca se manda al modelo.** El agente trabaja con el catálogo y con agregados | — |
| **Logs y telemetría** | Sin valores de filtros | Sin valores | Sin valores | — |

**Permisos propuestos**, que se asignan por rol en el módulo de autenticación:

- `reporting.pii.financial`: ver P1 completo.
- `reporting.pii.personal`: ver P2 real.

Por defecto, **nadie** los tiene. Se otorgan explícitamente.

### Propuesta: reglas complementarias

1. **El tratamiento se aplica en el servidor**, al generar la consulta. Nunca se resuelve ocultando en pantalla.
2. **Runs guardados:** cada persona ve un run guardado con **sus propios** permisos. Si alguien sin permiso abre un run que ejecutó alguien con permiso, ve la versión enmascarada.
3. **Seudónimos:** son estables por tenant, así que el mismo pagador siempre recibe el mismo código y se puede contar y comparar sin identificarlo. No son reversibles desde el producto.
4. **Auditoría:** queda registrado quién ejecutó, exportó o programó reportes que incluyen P2 real. El registro se conserva según la política general.
5. **Supresión (derecho al olvido):** un pedido de borrado se ejecuta en origen, llega como evento y Silver lo aplica en el siguiente rebuild. Bronze ya tolera estos borrados.
6. **Textos libres:** por defecto son P2. Se puede analizar la opción de detectar y enmascarar nombres dentro del texto, pero no para la v1.
7. **Nuevos campos:** un campo sin clase **no se publica** en el catálogo. El build lo impide.

### Marcos legales a revisar

Hay que confirmar con legal en qué países operan los tenants. Para la región, al menos:

| País | Norma |
|---|---|
| Argentina | Ley 25.326 |
| México | LFPDPPP |
| Brasil | LGPD |
| Chile | Ley 19.628, y su reforma por la Ley 21.719 |

Además, el contrato con cada cliente, que define si somos encargados del tratamiento.

### Qué tiene que validar el PO

- [ ] La clasificación P0–P3 y los ejemplos.
- [ ] Que P3 **no** llegue a reportes.
- [ ] Que, sin permiso, P2 se vea como seudónimo (y no, por ejemplo, oculto del todo).
- [ ] Los dos permisos y que nadie los tenga por defecto.
- [ ] Las reglas de envíos programados (junto con DEF-6).
- [ ] Que el agente AI nunca reciba P2 ni P3.
- [ ] Quién hace la revisión legal y para cuándo.

**Validación:** ⏳ — *(estado · nombre · fecha · comentarios)*

---

## DEF-2 · Moneda de reporte

**Pregunta:** ¿en qué moneda se consolidan los montos cuando un reporte mezcla cuentas o eventos en monedas distintas?

**Propuesta:**
- **v1:** **USD** para todos los tenants, con el tipo de cambio **diario** de la fecha del movimiento (fecha contable; si no hay, fecha de creación). Si falta la tasa de un día, se usa la última disponible, con aviso.
- **v2:** la moneda de vista del grupo de empresas. El dato ya existe en th_saas.

Las columnas en moneda original se mantienen siempre. El Builder avisa si se suman monedas distintas.

**Alternativas:**
- Moneda por tenant desde la v1: más trabajo en Silver, y hay que definirla por cada cliente.
- Que el usuario elija la moneda al ejecutar: es lo más flexible y lo más costoso.

**Validación:** ⏳

## DEF-3 · Frescura de los datos

**Pregunta:** ¿cada cuánto se actualizan los datos que ven los reportes?

**Propuesta:**
- Actualización **diaria a las 05:00** hora del tenant, más **cada 4 horas** durante el día hábil para Financial Events.
- El Viewer muestra siempre **"datos al <fecha y hora>"**.
- Los envíos programados esperan la actualización del día (hasta un tope). Si la actualización no llega, se envía igual e indica la fecha real de los datos.

**Alternativas:**
- Solo diaria: más simple y más barata.
- Casi en tiempo real: requiere otra arquitectura, que el diseño del lake descartó a propósito.

**Validación:** ⏳

## DEF-4 · Retención de runs y exportaciones

**Propuesta:**

| Qué | Cuánto se conserva |
|---|---|
| Resultado de cada run | **90 días** |
| Metadatos del run (quién, cuándo, parámetros, filas) | **13 meses** |
| Archivos exportados o enviados | No se guardan después de la entrega |
| Tamaño de un run | Hasta **100.000 filas** guardadas; para más, exportación directa |

**Validación:** ⏳

## DEF-5 · Permisos por Data Set

**Propuesta:**

| Rol | Puede |
|---|---|
| **Visualizador** | Ejecutar y ver reportes compartidos con él; exportar según DEF-1 |
| **Creador** | Todo lo anterior, más crear y editar sus reportes y compartirlos dentro del tenant |
| **Programador** | Todo lo anterior, más programar envíos |
| **Admin de reporting** | Gestionar reportes de otros y asignar acceso por Data Set |

Además:
- **Acceso por Data Set:** Financial Events, Accounts, Reconciliation y Tagging se habilitan por rol. Por ejemplo, alguien de conciliación puede no ver saldos.
- Un reporte es **privado** por defecto y se comparte explícitamente.

**Validación:** ⏳

## DEF-6 · Envíos programados

**Propuesta:**
- **Frecuencia mínima: diaria** (ya decidido). Cron configurable, con presets.
- **Destinatarios v1:** solo **usuarios del tenant**. Los emails externos quedan para la v2, con aprobación de un admin y las reglas de DEF-1.
- **Formatos:** CSV, XLSX o link al Viewer. PDF con gráficos en una etapa posterior.
- **Límites:** hasta 20 destinatarios por envío y 20 programaciones activas por tenant. Son ajustables por plan comercial (DEF-9).
- **Si un envío falla,** se avisa al dueño del reporte. Después de 3 fallos seguidos, la programación se pausa sola.

**Validación:** ⏳

## DEF-7 · Modelo de Tag Groups

Decidido: los Tag Groups los aporta un **módulo nuevo de Tagging**. Falta definir cómo funcionan.

**Propuesta:**

| Aspecto | Propuesta |
|---|---|
| Niveles | Un grupo contiene tags. **Un solo nivel** en la v1, sin subgrupos. |
| Exclusividad | Cada grupo se marca como **exclusivo** (un solo tag de ese grupo por ítem, por ejemplo "Centro de costo") o **múltiple** (por ejemplo "Naturaleza"). |
| A qué se aplican | v1: transacciones bancarias. v2: eventos financieros y movimientos de conciliación. |
| Qué pasa con lo actual | Los tags actuales de th_saas se migran al módulo nuevo en un grupo "Sin grupo". Los tags de reglas de conciliación quedan como su propio origen. |

**Validación:** ⏳

## DEF-8 · Agente AI: datos y proveedor

**Decide:** CEO.

**Propuesta:**
- **El agente propone y nunca ejecuta.** No guarda, no programa ni envía sin confirmación del usuario.
- **Qué recibe el modelo:** el catálogo (nombres de campos, sin valores), los valores de categorías P0 (bancos, estados, monedas) y **resultados agregados** de vista previa. **Nunca** P2 ni P3 (DEF-1).
- **Proveedor:** el mismo que ya usa th_ai_orchestrator, con un contrato que garantice que los datos no se usan para entrenar y con retención mínima.
- **Registro de conversaciones:** 30 días, para mejorar la calidad; se puede desactivar por tenant.
- **Disponibilidad:** para los roles Creador o superior (DEF-5).

**Validación:** ⏳

## DEF-9 · Alcance comercial y prioridades

**Decide:** CEO.

**Preguntas:**
- ¿El Report Builder es parte del producto base o un módulo pago?
- ¿Hay límites por plan (programaciones, agente AI, Data Sets)?
- ¿Confirmamos el orden de releases del [plan](04-plan-de-ejecucion.md#releases-lo-que-ve-el-usuario)?

| Release | Contenido |
|---|---|
| R1 | Eventos en tabla |
| R2 | Cuentas y cierre de caja |
| R3 | Conciliación y tags |
| R4 | Programados |
| R5 | Pivot y gráficos |
| R6 | Asistente AI |

**Propuesta:** mantener el orden. R2 (cierre de caja) es el caso de valor más claro para tesorería. Considerar adelantar R5 (gráficos) si se quiere mostrar el producto comercialmente antes.

**Validación:** ⏳
