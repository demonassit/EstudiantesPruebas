# Ejemplo de caso de prueba — Referencia

> Este archivo **no es una plantilla para llenar** ni un entregable de ninguna semana. Es un ejemplo ya resuelto que muestra cómo se ve un caso de prueba correcto en el formato oficial de la materia (el mismo que usan `casos-prueba-unidad.md`, `catalogo-casos-prueba.md`, `reporte-ejecucion.md`, etc.). Úsalo solo como referencia antes de llenar tus propias plantillas — no copies los datos, son inventados para ilustrar el formato.

## Caso A — Validar formato de correo (prueba de unidad, caja negra)

- **Propósito:** verificar que la función `validarCorreo(valor)` acepta únicamente cadenas con formato de correo electrónico válido (texto@dominio.extensión) y rechaza cualquier otro formato, para evitar que se guarden correos mal escritos en el registro de usuarios.
- **Prerrequisitos:** la función `validarCorreo()` existe y es invocable de forma aislada (sin conexión a base de datos ni red); no requiere que el usuario esté autenticado.
- **Indicadores:** la función retorna `true` solo cuando el valor de entrada cumple el formato `texto@dominio.extensión`; retorna `false` en cualquier otro caso, incluyendo cadena vacía o `null`.
- **Valores de entrada:**
  1. `"jmgomez@strategictechpr.com"` (válido)
  2. `"jmgomez@strategictechpr"` (sin extensión de dominio)
  3. `"jmgomez.com"` (sin arroba)
  4. `""` (cadena vacía)
- **Pasos de ejecución:**
  1. Invocar `validarCorreo("jmgomez@strategictechpr.com")` y registrar el resultado.
  2. Invocar `validarCorreo("jmgomez@strategictechpr")` y registrar el resultado.
  3. Invocar `validarCorreo("jmgomez.com")` y registrar el resultado.
  4. Invocar `validarCorreo("")` y registrar el resultado.
- **Resultado esperado / obtenido:**
  | Entrada | Esperado | Obtenido |
  |---|---|---|
  | `jmgomez@strategictechpr.com` | `true` | `true` |
  | `jmgomez@strategictechpr` | `false` | `false` |
  | `jmgomez.com` | `false` | `false` |
  | `""` | `false` | `false` |
- **Estado de la prueba:** Aprobada — los 4 valores de entrada coinciden con el resultado esperado.

**Por qué este caso está bien escrito:**
- El Propósito dice *qué* se prueba y *por qué* importa (no solo "probar la función").
- Los Valores de entrada cubren un caso válido y varios inválidos representativos (falta dominio, falta arroba, vacío) — no solo el camino feliz.
- Los Pasos de ejecución son lo bastante concretos como para que otra persona los repita exactamente igual.
- El Resultado esperado se define **antes** de ejecutar, y el Obtenido se llena después — nunca se escriben juntos de memoria.
- El Estado no es solo "Aprobada/Fallida": se justifica con una frase que dice qué tan sostenida está esa conclusión con la evidencia de la tabla.

## Caso B — Acceso al CRUD sin sesión válida (prueba de integración, caso negativo)

- **Propósito:** verificar que el endpoint `GET /api/usuarios` rechaza peticiones que no incluyen una sesión/token válido, para confirmar que el CRUD de usuarios está protegido y no expone datos a clientes no autenticados.
- **Prerrequisitos:** el servidor backend está desplegado y accesible; existe al menos un usuario registrado en la base de datos; se cuenta con Postman (o herramienta equivalente) configurado apuntando al ambiente real.
- **Indicadores:** el servidor responde con código HTTP `401 Unauthorized` (o `403 Forbidden`, según cómo esté implementado) y **no** incluye ningún dato de usuarios en el cuerpo de la respuesta.
- **Valores de entrada:** petición `GET /api/usuarios` sin encabezado `Authorization` ni cookie de sesión.
- **Pasos de ejecución:**
  1. Abrir Postman y crear una petición `GET` a `https://<host-real>/api/usuarios`.
  2. Confirmar que no se incluye ningún encabezado `Authorization` ni cookie de sesión.
  3. Enviar la petición y registrar el código de estado HTTP y el cuerpo de la respuesta.
  4. Repetir la petición con un token deliberadamente inválido (ej. `Authorization: Bearer token-falso`) para confirmar que tampoco se acepta.
- **Resultado esperado / obtenido:**
  - Esperado: `401 Unauthorized`, cuerpo sin datos de usuarios (solo mensaje de error).
  - Obtenido: `401 Unauthorized`, cuerpo `{ "error": "No autorizado" }` — sin datos de usuarios.
- **Estado de la prueba:** Aprobada — el sistema rechaza ambas peticiones (sin token y con token inválido) y no filtra datos.

**Por qué este caso está bien escrito:**
- Es un **caso negativo** explícito (lo que Web/el CRUD *no* debe permitir), no solo el camino feliz de login correcto — este tipo de caso es el que semana 10 pide explícitamente.
- El Indicador no es solo el código HTTP: también exige que no se filtre información, que es la parte que realmente importa de seguridad.
- Los Pasos incluyen una variante extra (token inválido, no solo ausente) sin que se pida un caso aparte — buena práctica, no imprescindible.
- El Resultado obtenido copia evidencia real (código + cuerpo de respuesta), no una descripción vaga como "funcionó bien".

## Errores comunes a evitar (vistos en plantillas mal llenadas)

- Escribir el Propósito igual al nombre del caso (ej. "Probar el login") sin decir qué condición específica se valida.
- Poner un solo valor de entrada cuando el caso amerita varios (solo el camino feliz, sin casos límite ni inválidos).
- Pasos de ejecución vagos ("probar la función") en vez de una secuencia numerada y repetible.
- Llenar "Resultado esperado" y "Resultado obtenido" con el mismo texto sin haber ejecutado nada — el Obtenido debe venir de una ejecución real, con evidencia (captura, respuesta HTTP, log).
- Estado de la prueba sin justificación ("Aprobada" a secas) — siempre debe apoyarse en la tabla/evidencia de arriba.
