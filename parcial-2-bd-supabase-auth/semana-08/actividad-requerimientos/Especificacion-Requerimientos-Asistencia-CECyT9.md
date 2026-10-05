# Especificación de Requerimientos — Sistema de Registro de Asistencia a Talleres CECyT 9

**Materia:** Pruebas de Software · **Unidad 2:** Planificación y diseño de las pruebas (Práctica 4, "Casos de prueba")
**Tipo:** Individual · **Versión del documento:** 1.0 (octubre 2026)

---

## Cómo usar este documento

Este documento describe **cómo debe comportarse** el sistema: es el contrato que el equipo de
desarrollo se comprometió a cumplir. Tu trabajo como equipo de pruebas es:

1. Leer cada requerimiento y **diseñar los casos de prueba** que demuestren si se cumple o no.
2. **Ejecutar** esos casos contra el sistema que está publicado en internet.
3. **Reportar** cada diferencia entre lo que dice este documento y lo que hace el sistema.

> **El documento manda, no el sistema.** Si el sistema hace algo distinto a lo que dice un requerimiento,
> encontraste un **defecto**, aunque la pantalla "se vea bien". No ajustes el resultado esperado
> para que coincida con lo que obtuviste.

---

## 1. Propósito y alcance

### 1.1 Propósito del sistema
Permite a los alumnos del CECyT 9 registrar su asistencia a los talleres que publica la escuela, y
permite al administrador publicar, editar y eliminar talleres, así como consultar quién asistió.

### 1.2 Sistema bajo prueba (SUT)

| Componente | Dirección | Cómo se prueba |
|---|---|---|
| Interfaz web (frontend) | `https://proyecto-front-cecyt9.vercel.app` | Navegador (Chrome/Edge) y sus herramientas de desarrollador (F12) |
| API REST (backend) | `https://proyectobackcecyt9.onrender.com` | Postman |
| Base de datos | Supabase (PostgreSQL) | No tienes acceso directo: se prueba a través de la API |

### 1.3 Dentro del alcance
Inicio y cierre de sesión, control de acceso por rol, navegación, administración de talleres,
registro de asistencia y consulta de asistentes.

### 1.4 Fuera del alcance
Rendimiento y carga, compatibilidad con navegadores antiguos y diseño visual (colores, tipografía).
Estos temas se trabajan en la Unidad 3.

---

## 2. Actores

| Actor | Descripción | ¿Tiene cuenta? |
|---|---|---|
| **Alumno / visitante** | Cualquier persona que entra al sitio. Consulta talleres y registra su asistencia. | No |
| **Administrador** | Personal de la escuela que gestiona los talleres. | Sí (correo y contraseña) |

> El correo y la contraseña del administrador te los da tu docente en clase. **Nunca** los escribas en
> tu reporte, en capturas de pantalla ni en archivos que subas a GitHub.

---

## 3. Glosario

| Término | Significado |
|---|---|
| **Sesión** | Periodo en el que el servidor reconoce al administrador después de iniciar sesión. Se mantiene con una cookie llamada `connect.sid`. |
| **Cookie** | Dato pequeño que el servidor guarda en el navegador para reconocerte en las siguientes peticiones. |
| **Boleta** | Número de identificación del alumno en el IPN. |
| **Cupo** | Número máximo de alumnos que pueden registrarse en un taller. |
| **Código de estado HTTP** | Número de 3 dígitos con el que la API indica el resultado de una petición (ver sección 7). |
| **UUID** | Identificador único con formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` que usa el sistema para cada taller. |
| **Inactividad** | Tiempo durante el cual el administrador no hace ninguna petición al sistema. |

---

## 4. Reglas de negocio

| ID | Regla |
|---|---|
| **RN-01** | La boleta está formada por **exactamente 10 dígitos numéricos** (ejemplo: `2026090123`). |
| **RN-02** | Un alumno (boleta) solo puede registrarse **una vez** en el mismo taller. Sí puede registrarse en talleres distintos. |
| **RN-03** | Un taller no puede tener más asistentes que su **cupo**. Cuando se llena, ya no admite registros. |
| **RN-04** | Si al crear un taller no se indica un cupo, el sistema le asigna **30**. |
| **RN-05** | El nombre del alumno es obligatorio y no puede estar formado solo por espacios en blanco. |
| **RN-06** | Solo el **administrador** puede crear, editar y eliminar talleres, y ver la lista de alumnos registrados (nombre y boleta son datos personales). |
| **RN-07** | Las decisiones de seguridad las toma **el servidor**. Lo que muestre u oculte la interfaz no sustituye la validación del servidor, pero la interfaz tampoco debe ofrecer opciones que el usuario no tiene permitidas. |

---

## 5. Requerimientos funcionales

Describen **qué debe hacer** el sistema. La columna *Acceso* indica quién puede usar la función.

| ID | Módulo | Requerimiento | Acceso | Comportamiento esperado |
|--------|-----------|---------------|-------------|-----------------------------------------------------|
| **RF-01** | Sesión | Iniciar sesión | Administrador | Con correo y contraseña correctos, abre una sesión, entrega la cookie `connect.sid` y lleva al **Panel de administrador**. Si falta el correo o la contraseña, responde **400** indicando que ambos son obligatorios. Si el correo no existe o la contraseña es incorrecta, responde **401** con el **mismo** mensaje genérico ("Credenciales inválidas"), para no revelar qué correos están registrados. |
| **RF-02** | Sesión | Consultar la sesión activa | Público | `GET /api/auth/me` devuelve nombre y rol del usuario si hay sesión, o `null` si no la hay. |
| **RF-03** | Sesión | Cerrar sesión | Administrador | El servidor destruye la sesión: desde ese momento ninguna operación de administrador funciona con esa cookie. La interfaz regresa al inicio y **deja de mostrar** toda opción de administrador ("Panel de administrador", "Cerrar sesión"), aunque el usuario recargue la página o navegue a otra sección. |
| **RF-04** | Navegación | Barra de navegación según el rol | Público | **Sin sesión:** muestra "Talleres" e "Iniciar sesión". **Con sesión de administrador:** muestra "Talleres", "Panel de administrador" y "Cerrar sesión (nombre)". Siempre refleja **el estado real de la sesión en el servidor**, no un dato que el usuario pueda modificar en su navegador. |
| **RF-05** | Navegación | Acceso al Panel de administrador | Administrador | Quien entre a `/admin/talleres` sin sesión válida de administrador (por ejemplo, escribiendo la dirección a mano) es redirigido a **Iniciar sesión** sin ver el panel ni la lista de cursos. Si la sesión expira mientras usa el panel, la siguiente acción también lo redirige. |
| **RF-06** | Talleres | Consultar talleres | Público | Muestra la lista de talleres ordenada por fecha (de la más próxima a la más lejana), con nombre, instructor y fecha. |
| **RF-07** | Talleres | Ver el detalle de un taller | Público | Muestra nombre, instructor, fecha y el contador **"Asistentes registrados: X / cupo"**. Si el taller no existe, responde **404** "Taller no encontrado". |
| **RF-08** | Talleres | Publicar un taller | Administrador | Recibe nombre y fecha (obligatorios), instructor y cupo (opcionales, RN-04). Crea el taller y responde **201**. Si falta el nombre o la fecha, responde **400**. |
| **RF-09** | Talleres | Editar un taller | Administrador | Actualiza los datos y responde **200**. Si falta el nombre o la fecha, responde **400**; si el taller no existe, **404**. |
| **RF-10** | Talleres | Eliminar un taller | Administrador | Elimina el taller junto con sus asistencias y responde **204**. Si no existe, responde **404**. |
| **RF-11** | Talleres | Resumen para el administrador | Administrador | `GET /api/admin/resumen` devuelve el total de talleres, el total de asistencias y la lista de talleres con su cupo. |
| **RF-12** | Asistencias | Registrar asistencia | Público | Recibe taller, nombre del alumno y boleta. **(a)** Datos válidos, con cupo y boleta no registrada en ese taller: **201**, "Asistencia registrada correctamente" y el contador aumenta en 1. **(b)** Falta un dato o el nombre solo tiene espacios (RN-05): **400**. **(c)** Boleta que no cumple RN-01: **400** con un mensaje que explique el formato. **(d)** Taller inexistente: **404**. **(e)** Boleta ya registrada en el taller (RN-02): **409**. **(f)** Taller sin cupo (RN-03): **409**, y la interfaz deja de ofrecer el formulario. En pantalla, los errores se distinguen visualmente de los mensajes de éxito. |
| **RF-13** | Asistencias | Consultar alumnos registrados en un taller | Administrador | El **administrador** ve en el detalle del taller la lista "Alumnos registrados" con nombre y boleta. Un **alumno/visitante** no ve esa lista ni ningún mensaje de error técnico en su lugar. Por API, `GET /api/talleres/:id/asistencias` sin sesión responde **401**. |

---

## 6. Requerimientos no funcionales

Describen **cómo** debe comportarse el sistema (calidad y seguridad), sin importar la función que se use.

| ID | Categoría | Requerimiento | Criterio de aceptación | Relacionado con |
|---------|-----------------|----------------------------|------------------------------|----------------|
| **RNF-01** | Seguridad: control de acceso | Las operaciones exclusivas del administrador distinguen entre "no has iniciado sesión" y "no tienes permiso". | Sin sesión → **401**. Con sesión pero sin rol de administrador → **403**. | RF-08 a RF-11, RF-13 |
| **RNF-02** | Seguridad: confidencialidad | Las contraseñas se almacenan cifradas y nunca salen del servidor. | Ninguna respuesta de la API incluye la contraseña ni su versión cifrada. | RF-01, RF-02 |
| **RNF-03** | Seguridad: gestión de sesión | La sesión del administrador expira sola tras **2 horas de inactividad**; cada petición del administrador reinicia el contador. | La cookie `connect.sid` tiene una expiración de máximo 2 horas y, pasado ese tiempo sin actividad, las operaciones de administrador dejan de funcionar. | RF-02, RF-05 |
| **RNF-04** | Seguridad: integridad | El rol del usuario no puede modificarse ni falsificarse desde el navegador. | Ningún dato editable en el navegador hace que la interfaz o la API traten al usuario como administrador. | RN-07, RF-04, RF-05 |
| **RNF-05** | Confiabilidad: manejo de errores | Los errores se comunican de forma clara y con el código correcto. | Un error causado por el usuario responde con un código 4xx y un mensaje entendible. Un dato mal escrito nunca provoca un **500**. | RF-07 a RF-12 |
| **RNF-06** | Seguridad: autenticación | El inicio de sesión se protege contra intentos de adivinar la contraseña. | Después de **5 intentos fallidos** con el mismo correo desde el mismo equipo, se bloquean nuevos intentos durante **15 minutos** con respuesta **429** y un mensaje de "demasiados intentos". Los inicios de sesión correctos no cuentan como fallidos. | RF-01 |

---

## 7. Contrato de la API

| Método | Ruta | Acceso | Respuestas esperadas |
|---|---|---|---|
| POST | `/api/auth/login` | Público | 200, 400, 401, 429 |
| POST | `/api/auth/logout` | Público | 200 |
| GET | `/api/auth/me` | Público | 200 |
| GET | `/api/talleres` | Público | 200 |
| GET | `/api/talleres/:id` | Público | 200, 404 |
| POST | `/api/talleres` | Administrador | 201, 400, 401, 403 |
| PUT | `/api/talleres/:id` | Administrador | 200, 400, 401, 403, 404 |
| DELETE | `/api/talleres/:id` | Administrador | 204, 401, 403, 404 |
| GET | `/api/talleres/:id/asistencias` | Administrador | 200, 401, 403, 404 |
| POST | `/api/asistencias` | Público | 201, 400, 404, 409 |
| GET | `/api/admin/resumen` | Administrador | 200, 401, 403 |

**Formato de los datos (JSON):**

```json
// POST /api/auth/login
{ "correo": "...", "contrasena": "..." }

// POST y PUT /api/talleres
{ "nombre": "PRUEBA-REQ Taller", "instructor": "Ing. Prueba", "fecha": "2026-12-01", "cupo": 2 }

// POST /api/asistencias
{ "taller_id": "<uuid del taller>", "nombre_alumno": "PRUEBA-REQ Juan", "boleta": "2026000001" }
```

**Significado de los códigos:** 200 OK · 201 creado · 204 eliminado (sin contenido) · 400 datos inválidos ·
401 no has iniciado sesión · 403 sesión sin permiso · 404 no existe · 409 conflicto con el estado actual
(duplicado, sin cupo) · 429 demasiadas peticiones · 500 error interno del servidor.

---

## 8. La actividad

### 8.1 Reglas antes de probar

1. Es un sistema **real**, compartido con todo el grupo y con otras materias. No intentes tumbarlo.
2. Todo dato que crees debe empezar con **`PRUEBA-REQ`** (talleres y nombres de alumno).
3. **Para probar cupos y duplicados, crea tu propio taller** `PRUEBA-REQ <tu nombre>` con un cupo
   pequeño (por ejemplo, 2) y **elimínalo al terminar**. No llenes los talleres reales: crear tus
   propios datos de prueba es parte de los *prerrequisitos* del caso.
4. Para probar RNF-06 (bloqueo por intentos), usa un **correo inventado** (por ejemplo
   `tu.nombre@prueba.mx`), **nunca** el del administrador, y haz como máximo **8 intentos**.
5. El servidor se duerme tras 15 minutos sin uso: la primera petición puede tardar hasta 50 segundos.

### 8.2 Qué tienes que hacer

**Parte 1 — Diseño de casos de prueba.** Para **cada** requerimiento funcional (RF-01 a RF-13) y no
funcional (RNF-01 a RNF-06), diseña los casos necesarios para demostrar si se cumple:

- Al menos **un caso positivo** (el sistema hace lo que debe) y **un caso negativo** (el sistema rechaza
  lo que debe rechazar).
- **Casos de valores límite** donde haya un número de por medio. Por ejemplo, en RN-01, RN-03 y RNF-06,
  prueba justo en el límite, uno antes y uno después.
- Indica si el caso se ejecuta por **interfaz** (navegador), por **API** (Postman) o por ambas.

Usa esta plantilla (la misma de la Práctica 4):

| Campo | Contenido |
|---|---|
| ID del caso | CP-01, CP-02, ... |
| Requerimiento | RF-xx / RNF-xx / RN-xx que verifica |
| Propósito | Qué se quiere demostrar, en una oración |
| Prerrequisitos | Qué debe existir antes (sesión iniciada, taller de prueba creado, etc.) |
| Datos de entrada | Valores exactos que vas a usar |
| Pasos de ejecución | Numerados, lo bastante claros para que otra persona los repita |
| Resultado esperado | Lo que dice **este documento** que debe pasar (código HTTP, mensaje, pantalla) |
| Resultado obtenido | Lo que **realmente** pasó (se llena al ejecutar) |
| Estado | Aprobado / Fallido / Bloqueado |

**Parte 2 — Matriz de trazabilidad.** Una tabla con cada requerimiento en una fila y los ID de los
casos que lo cubren. Ningún requerimiento debe quedar sin casos.

**Parte 3 — Ejecución.** Ejecuta tus casos. Para los de API, arma una colección de Postman (puedes
reutilizar lo que hiciste en la semana 7). Para los de interfaz, toma capturas de pantalla como
evidencia (sin credenciales visibles).

**Parte 4 — Reporte de defectos.** Por cada caso **Fallido**, registra un defecto:

| Campo | Contenido |
|---|---|
| ID del defecto | DEF-01, DEF-02, ... |
| Caso(s) de prueba | CP-xx que lo detectaron |
| Requerimiento incumplido | RF/RNF/RN |
| Descripción | Qué pasa vs. qué debería pasar |
| Pasos para reproducirlo | Numerados |
| Evidencia | Captura o respuesta de Postman |
| Severidad | Crítica / Alta / Media / Baja (justifica tu elección) |

> **Pistas para pensar como tester:** ¿qué pasa si haces lo mismo dos veces? ¿Y si recargas la página?
> ¿Y si escribes la dirección a mano en vez de usar los botones? ¿Qué guarda el sitio en tu navegador
> (F12 → Application/Aplicación)? ¿Qué fecha de expiración tiene la cookie de sesión? ¿Qué pasa si
> cierras sesión y vuelves atrás?

### 8.3 Entregables (en Teams)

1. Documento (Word o PDF) con: casos de prueba, matriz de trazabilidad, resultados de la ejecución y
   reporte de defectos.
2. Colección de Postman exportada (`.json`) **sin** credenciales del administrador.
3. Evidencia de que eliminaste tu taller `PRUEBA-REQ` al terminar.

**Fecha de entrega:** la que indique tu docente en Teams.
