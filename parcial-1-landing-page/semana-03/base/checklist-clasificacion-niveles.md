# Checklist — Clasificación de pruebas por nivel (unidad / integración / sistema)

Contesta las preguntas en orden para cada uno de tus 3 casos de semana 2. La primera que responda "sí" define el nivel — no sigas evaluando después de la primera coincidencia.

| # | Pregunta | Si es "sí" → nivel |
|---|---|---|
| 1 | ¿Prueba una función/unidad de código aislada, **sin** tocar red, base de datos ni otro módulo? | **Unidad** |
| 2 | ¿Prueba 2 o más componentes trabajando juntos (ej. una ruta + la base de datos), pero **no** replica el flujo completo que haría un usuario real de punta a punta? | **Integración** |
| 3 | ¿Simula lo que haría un usuario/cliente real, de punta a punta, contra el sistema ya desplegado (o una réplica fiel de él)? | **Sistema** |

## Nota importante — caja negra/blanca ≠ nivel

**Caja negra/caja blanca** es sobre *cómo diseñaste* el caso (¿viste el código o no?). **Unidad/integración/sistema** es sobre *qué tanto del sistema* se ejecuta cuando corres ese caso. Son dos preguntas distintas: un caso diseñado con caja blanca no es automáticamente una prueba de "unidad" — depende de cómo lo ejecutes, no de cómo lo diseñaste.

## Aplica el checklist a tus 3 casos

| Caso | ¿Aísla una función sin red/BD? | ¿2+ componentes, no de punta a punta? | ¿Simula un cliente real contra el sistema desplegado? | **Nivel** |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
