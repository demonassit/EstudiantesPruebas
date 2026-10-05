# Tarea Semana 7 (5-9 oct) — Pruebas automatizadas con Postman

**Materia:** Pruebas de Software · **Tipo:** Individual · **Unidad 2:** pruebas de API

**Sistema bajo prueba (SUT):** API real del Registro de Asistencia a Talleres del CECyT 9, desplegada en
`https://proyectobackcecyt9.onrender.com`

**Objetivo:** programar en Postman una colección de **pruebas automatizadas** que verifique tres
funciones del sistema: el **registro de asistencia**, el **inicio de sesión** del administrador y los
**errores de autorización** (qué pasa cuando alguien sin sesión intenta usar funciones protegidas).

> **Una prueba que falla no es un error tuyo.** Si escribiste bien el resultado esperado y el sistema
> responde otra cosa, encontraste un **hallazgo** (defecto). Tu trabajo es documentarlo, no "arreglar"
> la prueba para que pase.

---

## Reglas antes de empezar

1. Es un sistema **real en internet**, compartido con todo el grupo y con otras materias. No intentes
   tumbarlo ni mandar cientos de peticiones.
2. Todo dato que crees debe empezar con `PRUEBA-POSTMAN` (la colección ya lo hace) para que el docente
   pueda limpiarlo después.
3. El correo y la contraseña del administrador te los da tu docente en clase. **Nunca** los subas a
   GitHub ni los compartas: antes de exportar tu colección, borra esos dos valores.
4. El servidor está en el plan gratuito de Render y **se duerme tras 15 minutos sin uso**. La primera
   petición puede tardar hasta 50 segundos. Es normal; espera y vuelve a intentar.

---

## Paso 1 — Preparar Postman

1. Instala **Postman** de escritorio (https://www.postman.com/downloads/) e inicia sesión con una cuenta
   gratuita.
2. Descarga el archivo `coleccion-base.json` de esta carpeta.
3. En Postman: botón **Import** → arrastra `coleccion-base.json` → **Import**.
4. En la barra izquierda aparece la colección **"CECyT9 - Semana 7 - Registro, Login y Autorización"**
   con 5 carpetas: `00 - Preparación`, `01 - Registro de asistencia`, `02 - Inicio de sesión`,
   `03 - Acceso autorizado (con sesión)` y `04 - Errores de autorización (sin sesión)`.

## Paso 2 — Configurar las variables de la colección

1. Haz clic en el nombre de la colección → pestaña **Variables**.
2. Revisa que `base_url` sea `https://proyectobackcecyt9.onrender.com`.
3. En `correo_admin` y `contrasena_admin` escribe (en la columna *Current value*) los datos que te dio
   tu docente.
4. Las demás variables (`taller_id`, `asistencia_id`, `boleta`, `taller_prueba_id`,
   `mensaje_error_login`) se dejan **vacías**: las van a llenar las propias pruebas mientras corren.
5. Guarda con **Ctrl + S**.

> En cada petición, `{{base_url}}` se reemplaza por el valor de la variable. Así, si mañana el sistema
> cambia de servidor, solo cambias un lugar.

## Paso 3 — Entender cómo se programa una prueba en Postman

Cada petición tiene una pestaña **Scripts** con dos secciones:

| Sección | Cuándo corre | Para qué la usamos |
|---|---|---|
| **Pre-request** | *antes* de mandar la petición | generar datos (por ejemplo, una boleta distinta cada vez) |
| **Post-response** | *después* de recibir la respuesta | escribir las **pruebas** (aserciones) |

Las instrucciones básicas que vas a usar:

```javascript
// Una prueba: nombre descriptivo + función que verifica algo
pm.test('Status 200', () => pm.response.to.have.status(200));

// Leer el cuerpo JSON de la respuesta
const body = pm.response.json();

// Verificaciones con pm.expect (librería Chai)
pm.expect(body.rol).to.eql('admin');             // igual a
pm.expect(body).to.have.property('id');          // tiene la propiedad
pm.expect(lista).to.be.an('array');              // es un arreglo
pm.expect(body.error).to.include('obligatorios'); // contiene el texto
pm.expect(pm.response.code).to.be.oneOf([400, 404]); // es uno de estos

// Guardar un valor para usarlo en otra petición
pm.collectionVariables.set('taller_id', body.id);
pm.collectionVariables.get('taller_id');

// Leer un encabezado de la respuesta
pm.response.headers.get('Set-Cookie');
```

Después de pulsar **Send**, abajo, en la pestaña **Test Results**, ves cada prueba en verde (PASS) o en
rojo (FAIL).

---

## Paso 4 — Carpeta `00 - Preparación` (ya resuelta, solo estúdiala)

**P-01 GET /** — Abre la petición, ve a **Scripts → Post-response** y lee el código. Pulsa **Send**.
Debes ver 2 pruebas en verde.

**P-02 GET /api/talleres** — Además de probar, esta petición **guarda el id del primer taller** en la
variable `taller_id`. Pulsa **Send** y luego revisa la pestaña **Variables** de la colección: `taller_id`
ya tiene valor.

```javascript
pm.test('Status 200', () => pm.response.to.have.status(200));
const talleres = pm.response.json();
pm.test('Regresa una lista con al menos un taller', () => {
  pm.expect(talleres).to.be.an('array').that.is.not.empty;
});
pm.collectionVariables.set('taller_id', talleres[0].id);
```

> **Encadenar peticiones** (usar la respuesta de una como entrada de otra) es la técnica clave de esta
> tarea. Fíjate que el resto de la colección usa `{{taller_id}}`.

---

## Paso 5 — Carpeta `01 - Registro de asistencia` (POST /api/asistencias)

El alumno se registra a un taller mandando `taller_id`, `nombre_alumno` y `boleta`.

### R-01 Registro válido (guiado)

1. Abre **R-01**. En la pestaña **Body** verás:

   ```json
   { "taller_id": "{{taller_id}}", "nombre_alumno": "PRUEBA-POSTMAN {{$randomFirstName}}", "boleta": "{{boleta}}" }
   ```

   `{{$randomFirstName}}` es una variable dinámica de Postman: inventa un nombre en cada envío.

2. En **Scripts → Pre-request** está el código que genera una boleta de 10 dígitos distinta cada vez:

   ```javascript
   const boleta = '2026' + Math.floor(100000 + Math.random() * 900000);
   pm.collectionVariables.set('boleta', boleta);
   ```

3. En **Scripts → Post-response** están las pruebas:

   ```javascript
   pm.test('Status 201 Created', () => pm.response.to.have.status(201));
   const body = pm.response.json();
   pm.test('Regresa el registro creado con id', () => pm.expect(body).to.have.property('id'));
   pm.test('Guarda la boleta enviada', () => pm.expect(body.boleta).to.eql(pm.collectionVariables.get('boleta')));
   pm.test('Pertenece al taller enviado', () => pm.expect(body.taller_id).to.eql(pm.collectionVariables.get('taller_id')));
   pm.test('Tiene fecha de registro', () => pm.expect(body.fecha_registro).to.be.a('string'));
   pm.collectionVariables.set('asistencia_id', body.id);
   ```

4. Pulsa **Send**. Las 5 pruebas deben pasar.

### R-02 Falta la boleta (guiado)

Caso **negativo**: mandamos el registro sin boleta. El sistema debe rechazarlo con **400 Bad Request**.

```javascript
pm.test('Status 400 Bad Request', () => pm.response.to.have.status(400));
pm.test('Explica qué campos faltan', () => pm.expect(pm.response.json().error).to.include('obligatorios'));
```

### R-03 a R-06 — Programa tú las pruebas

Las peticiones ya están armadas (revisa el **Body** de cada una). En **Post-response** borra el
comentario `// TODO` y escribe las pruebas que verifiquen el resultado esperado:

| Caso | Qué se manda | Resultado esperado |
|---|---|---|
| R-03 Cuerpo vacío | `{}` | **400** |
| R-04 Taller que no existe | `taller_id` = `{{taller_id_inexistente}}` (puros ceros) | un error **del cliente** (**400 o 404**), nunca un error del servidor (5xx) |
| R-05 Duplicado | la **misma** `{{boleta}}` de R-01, en el mismo taller | **409 Conflict**: un alumno no debe registrarse dos veces al mismo taller |
| R-06 Boleta con letras | `boleta` = `ABC123` | **400**: la boleta del IPN son 10 dígitos |

> Pista para R-04: usa `pm.expect(pm.response.code).to.be.oneOf([400, 404]);`

---

## Paso 6 — Carpeta `02 - Inicio de sesión` (POST /api/auth/login)

El login usa **cookies de sesión**: si las credenciales son correctas, el servidor responde con un
encabezado `Set-Cookie: connect.sid=...`. **Postman guarda esa cookie automáticamente** y la manda en
todas las peticiones siguientes al mismo dominio, igual que un navegador. Puedes verla en el enlace
**Cookies** (debajo del botón Send).

### L-04 Credenciales correctas (guiado)

Body: `{ "correo": "{{correo_admin}}", "contrasena": "{{contrasena_admin}}" }`

```javascript
pm.test('Status 200', () => pm.response.to.have.status(200));
const body = pm.response.json();
pm.test('Rol de administrador', () => pm.expect(body.rol).to.eql('admin'));
pm.test('No expone el hash de la contraseña', () => pm.expect(body).to.not.have.property('contrasena_hash'));

const cookie = pm.response.headers.get('Set-Cookie') || '';
pm.test('Entrega cookie de sesión connect.sid', () => pm.expect(cookie).to.include('connect.sid='));
pm.test('La cookie es HttpOnly', () => pm.expect(cookie).to.include('HttpOnly'));

// Una sesión de administrador debe caducar (aquí pedimos máximo 8 horas)
pm.test('La sesión expira en máximo 8 horas', () => {
  const m = cookie.match(/Expires=([^;]+)/i);
  if (!m) return; // sin Expires = la cookie muere al cerrar el navegador, aceptable
  const horas = (new Date(m[1]) - new Date()) / 36e5;
  pm.expect(horas).to.be.at.most(8);
});
```

> **¿Por qué `HttpOnly`?** Impide que JavaScript del navegador lea la cookie, lo que dificulta que un
> script malicioso robe la sesión.

### L-01, L-02, L-03 y L-05 — Programa tú las pruebas

| Caso | Qué se manda | Resultado esperado |
|---|---|---|
| L-01 Sin correo ni contraseña | `{}` | **400** y un mensaje que diga qué falta |
| L-02 Correo no registrado | `nadie@cecyt9.ipn.mx` | **401** con el mensaje `Credenciales inválidas`. **Guarda ese mensaje** en la variable `mensaje_error_login` |
| L-03 Contraseña incorrecta | correo real + contraseña equivocada | **401** y **exactamente el mismo mensaje** que L-02 (compáralo con `mensaje_error_login`) |
| L-05 GET /api/auth/me | (después de L-04) | **200** y `usuario.rol` igual a `admin` |

> **¿Por qué L-03 debe dar el mismo mensaje que L-02?** Si el sistema dijera "correo no existe" en un
> caso y "contraseña incorrecta" en el otro, un atacante podría averiguar qué correos están registrados
> (*enumeración de usuarios*).

**Importante:** el orden importa. L-04 debe correr antes que L-05 y antes de la carpeta 03.

---

## Paso 7 — Carpeta `03 - Acceso autorizado (con sesión)`

Con la sesión abierta en L-04, el administrador debe poder usar las funciones protegidas. Programa las
pruebas:

| Caso | Petición | Resultado esperado |
|---|---|---|
| S-01 | GET `/api/talleres/{{taller_id}}/asistencias` | **200**, un arreglo que **incluye** el `asistencia_id` creado en R-01 (pista: `lista.map(a => a.id)`) |
| S-02 | POST `/api/talleres` con un taller `PRUEBA-POSTMAN` | **201**, con `id`. **Guárdalo** en `taller_prueba_id` |
| S-03 | DELETE `/api/talleres/{{taller_prueba_id}}` | **204 No Content** (así no dejamos basura) |
| S-04 | POST `/api/auth/logout` | **200** y `mensaje` igual a `Sesión cerrada` |
| S-05 | GET `/api/auth/me` | `usuario` es `null` (la sesión ya no existe) |

---

## Paso 8 — Carpeta `04 - Errores de autorización (sin sesión)`

Ahora la sesión ya está cerrada (S-04). Vamos a comprobar que **nadie sin sesión** pueda usar las
funciones del administrador.

### Teoría rápida: 401 vs 403

| Código | Significado | Cuándo se usa |
|---|---|---|
| **401 Unauthorized** | "No sé quién eres" | no hay sesión, o la sesión/credencial es inválida → hay que **autenticarse** |
| **403 Forbidden** | "Sé quién eres, pero no tienes permiso" | hay sesión válida pero el **rol** no alcanza |

Fuente: RFC 9110 (estándar de HTTP), secciones 15.5.2 y 15.5.4.

### A-01 Ver asistencias sin sesión (guiado)

```javascript
pm.test('Sin sesión responde 401 (no autenticado)', () => pm.response.to.have.status(401));
pm.test('No entrega datos protegidos', () => {
  const body = pm.response.json();
  pm.expect(body).to.not.be.an('array');
  pm.expect(body).to.have.property('error');
});
```

### A-02 a A-06 — Programa tú las pruebas

En todos los casos el resultado esperado es **401** y **que no se entreguen datos protegidos**.

| Caso | Petición |
|---|---|
| A-02 | POST `/api/talleres` (crear taller) |
| A-03 | PUT `/api/talleres/{{taller_id_inexistente}}` (editar) |
| A-04 | DELETE `/api/talleres/{{taller_id_inexistente}}` (eliminar) |
| A-05 | GET `/api/talleres/{{taller_id}}/asistencias` con un encabezado `Cookie: connect.sid=s%3Ainventada.firmafalsa` (sesión **falsificada**, ya viene en la pestaña *Headers*) |
| A-06 | GET `/api/admin/resumen`: es el reporte que consume el panel de administrador; también debe estar protegido. Además de 401, verifica que la respuesta **no** tenga la propiedad `totalAsistencias` |

> Pista: puedes copiar las pruebas de A-01 y adaptarlas.

---

## Paso 9 — Ejecutar todo de forma automática (Collection Runner)

1. Clic derecho sobre la colección → **Run collection**.
2. Verifica que estén seleccionadas **todas** las peticiones, **en el orden original** (00 → 04).
3. *Iterations*: **1**. Pulsa **Run**.
4. Al terminar verás cuántas pruebas pasaron y cuántas fallaron. Toma **captura de pantalla** del
   resumen.
5. Corre la colección **una segunda vez** y compara. ¿Se repiten los mismos resultados? Una prueba
   automatizada debe ser **repetible**.

---

## Paso 10 — Documentar los hallazgos

Por cada prueba que falle llena una ficha de **reporte de defecto**:

| Campo | Ejemplo de cómo llenarlo |
|---|---|
| ID | HAL-01 |
| Caso de prueba | R-04 Taller que no existe |
| Petición | POST /api/asistencias con taller_id `0000…` |
| Resultado esperado | 400 o 404 |
| Resultado obtenido | (el código y el cuerpo **reales** que viste) |
| Severidad | Alta / Media / Baja, con una línea que justifique |
| Evidencia | captura de la pestaña Test Results |
| Recomendación | qué debería cambiar en el sistema |

---

## Entregables (en Teams)

1. **Tu colección exportada** (`...` sobre la colección → **Export** → v2.1) **con `correo_admin` y
   `contrasena_admin` vacíos**. Nombre: `S7_Postman_<boleta>.json`.
2. **Reporte en PDF** con:
   - captura del Collection Runner (las 2 corridas);
   - tabla de los 24 casos: ID, resultado esperado, resultado obtenido, PASS/FAIL;
   - una ficha de defecto por cada hallazgo;
   - una conclusión de media página: ¿qué tan confiable es el registro, el login y la protección del
     sistema?, ¿qué corregirías primero y por qué?

**Fecha de entrega:** la que indique tu docente en Teams.
