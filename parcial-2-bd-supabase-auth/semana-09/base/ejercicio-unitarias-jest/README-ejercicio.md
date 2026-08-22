# Ejercicio complementario — Pruebas unitarias con Jest

Este ejercicio es independiente de la actividad oficial de esta semana (esa sigue siendo con Postman contra el CRUD real). Aquí llevas tus casos de prueba de unidad de semana 6-7 a código real, ejecutable con un framework de pruebas (Jest).

## Objetivo

Escribir pruebas unitarias automatizadas: por cada caso de prueba, una función `test()` que compara el resultado obtenido contra el esperado con `expect(...)`.

## Estructura

```
ejercicio-unitarias-jest/
├── package.json
├── validaciones.js       # código bajo prueba — NO lo modifiques
└── validaciones.test.js  # complétalo aquí
```

## Paso a paso

1. `npm install` — instala Jest.
2. Abre `validaciones.js`: 3 funciones puras (`validarCorreo`, `validarBoleta`, `validarContrasena`) — el mismo dominio que ya probaste a mano en semana 6-7.
3. En `validaciones.test.js` hay un `test.todo('...')` por cada caso que debes completar. Reemplaza cada uno por un `test('...', () => { expect(...).toBe(...); })` real. Ejemplo:

   ```js
   // antes:
   test.todo('correo con formato válido devuelve true');

   // después:
   test('correo con formato válido devuelve true', () => {
     expect(validarCorreo('correo@cecyt9.ipn.mx')).toBe(true);
   });
   ```

4. Corre `npm test`. Los `test.todo` pendientes aparecen como "todo" (no como error) — al terminar, todos deben aparecer como `PASS`.
5. Agrega al menos un caso más por función (más allá de los 3 ya listados) que tú mismo diseñes.

## Entregable

`validaciones.test.js` completo (sin `test.todo` pendientes) + la salida de `npm test` mostrando todo en verde.

---
La rúbrica de esta práctica la tiene tu docente por separado.
