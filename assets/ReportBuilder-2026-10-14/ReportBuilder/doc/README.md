# Report Builder: documentación

Esta carpeta explica el POC de Report Builder que está en `.temp/report-builder-poc` y propone cómo llevarlo a producción.

| Documento | Para qué sirve |
|---|---|
| [01 · Cómo se ideó](01-como-se-ideo.md) | El problema, qué encontramos en los repos y las decisiones de diseño, cada una con su porqué y las alternativas descartadas |
| [02 · Funcionalidades](02-funcionalidades.md) | Todo lo que el POC soporta hoy: Builder, Viewer, salidas, fórmulas, filtros, parámetros y JOINs |
| [03 · Módulos](03-modulos.md) | Qué hace cada módulo del POC, por qué existe y a qué repo iría en la versión real |
| [04 · Plan de ejecución](04-plan-de-ejecucion.md) | Las tareas en cortes funcionales, con dependencias, criterios de aceptación y notas para desarrollarlas con AI |
| [05 · Definiciones de PO/CEO](05-definiciones-po-ceo.md) | Decisiones de negocio a validar (política de datos personales, moneda, frescura, retención, permisos, envíos, Tag Groups, agente AI, alcance comercial) y registro de lo ya decidido |
| [06 · Épica funcional e historias](06-epica-funcional.md) | La épica para Jira: todo lo que el usuario puede hacer (incluido el asistente AI), en 14 paquetes entregables con sus historias y criterios de aceptación |

**Orden de lectura sugerido:** si sos PO o CEO, empezá por 05. Si vas a decidir la parte técnica, leé 01 y las secciones 1 y 4 de 04. Si vas a construir, 02, 03 y 04 completo. Si vas a ejecutar una tarea con un agente, usá la ficha de la tarea en 04 junto con [SILVER_MODEL.md](../SILVER_MODEL.md).

El POC corre con `npm run dev` (o `pnpm dev`), y `npm run smoke` ejecuta sus 44 invariantes. Ver [README del POC](../README.md).
