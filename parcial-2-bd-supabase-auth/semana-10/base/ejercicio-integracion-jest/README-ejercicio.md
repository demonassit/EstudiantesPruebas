# Ejercicio complementario — Pruebas de integración con Jest + Supertest

Este ejercicio es independiente de la actividad oficial de esta semana (esa sigue siendo con Postman contra el login + CRUD protegido real). Aquí practicas pruebas de integración con código real y automatizado (Jest + Supertest) sobre una mini API autocontenida.

## Objetivo

Escribir pruebas de integración: a diferencia de una unitaria, aquí se prueban varias piezas trabajando juntas — ruta + middleware + lógica de negocio — mandando peticiones HTTP reales contra la aplicación.

## Estructura

```
ejercicio-integracion-jest/
├── package.json
├── server.js       # la mini API — NO la modifiques
└── server.test.js  # complétalo aquí
```

## Paso a paso

1. `npm install` — instala Express, Jest y Supertest.
2. Abre `server.js`: expone 3 rutas —
   - `GET /api/talleres` (pública),
   - `POST /api/login` (usuario fijo: `admin@cecyt9.ipn.mx` / `ClaveSegura123`, regresa un token si las credenciales coinciden),
   - `GET /api/protegido` (requiere el header `Authorization: Bearer <token>`).
3. En `server.test.js` hay un `test.todo('...')` por caso. Reemplaza cada uno por una prueba real con `supertest`, mandando la petición contra `app` directamente (sin levantar un puerto):

   ```js
   // antes:
   test.todo('responde 200 con la lista de talleres');

   // después:
   test('responde 200 con la lista de talleres', async () => {
     const respuesta = await request(app).get('/api/talleres');
     expect(respuesta.status).toBe(200);
   });
   ```

4. Fíjate que ya hay **3 casos negativos** planteados (login incorrecto, sin token, token inválido) — igual que pide la rúbrica oficial de esta semana para las pruebas con Postman. Complétalos también.
5. Corre `npm test` y confirma que todos pasen.

## Entregable

`server.test.js` completo (sin `test.todo` pendientes) + la salida de `npm test` mostrando todo en verde.

---
La rúbrica de esta práctica la tiene tu docente por separado.
