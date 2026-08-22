const request = require('supertest');
const app = require('./server');

// Completa cada test.todo(...) con la prueba real, usando supertest para
// mandar la petición HTTP contra `app` (sin levantar un puerto). Ejemplo:
//
//   test('responde 200 con la lista de talleres', async () => {
//     const respuesta = await request(app).get('/api/talleres');
//     expect(respuesta.status).toBe(200);
//   });

describe('GET /api/talleres (pública)', () => {
  test.todo('responde 200 con la lista de talleres');
});

describe('POST /api/login', () => {
  test.todo('credenciales correctas devuelven un token');
  test.todo('credenciales incorrectas devuelven 401 (caso negativo)');
});

describe('GET /api/protegido', () => {
  test.todo('sin token responde 401 (caso negativo)');
  test.todo('con token inválido responde 401 (caso negativo)');
  test.todo('con el token que entrega /api/login responde 200');
});
