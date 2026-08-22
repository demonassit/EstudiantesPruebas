const { validarCorreo, validarBoleta, validarContrasena } = require('./validaciones');

// Completa cada test.todo(...) con su prueba real: test('descripción', () => {
// expect(validarX('...')).toBe(true/false); }). Cubre para cada función un
// caso válido, uno inválido y uno límite (justo en la frontera).

describe('validarCorreo', () => {
  test.todo('correo con formato válido devuelve true');
  test.todo('correo sin arroba devuelve false (inválido)');
  test.todo('correo vacío devuelve false (límite)');
});

describe('validarBoleta', () => {
  test.todo('boleta de 10 dígitos devuelve true');
  test.todo('boleta con letras devuelve false (inválido)');
  test.todo('boleta con 9 dígitos devuelve false (límite, uno menos)');
});

describe('validarContrasena', () => {
  test.todo('contraseña de 8 o más caracteres devuelve true');
  test.todo('contraseña vacía devuelve false (inválido)');
  test.todo('contraseña de 7 caracteres devuelve false (límite, uno menos del mínimo)');
});
