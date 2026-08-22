// validaciones.js
// Funciones puras de validación para el CRUD de usuarios — mismo dominio que
// los casos de prueba de unidad diseñados en semana 6-7 (correo, boleta,
// contraseña). Este archivo es el "código bajo prueba": no lo modifiques,
// solo escribe pruebas contra él en validaciones.test.js.

function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function validarBoleta(boleta) {
  if (typeof boleta !== 'string') return false;
  return /^\d{10}$/.test(boleta.trim());
}

function validarContrasena(contrasena) {
  if (typeof contrasena !== 'string') return false;
  return contrasena.length >= 8;
}

module.exports = { validarCorreo, validarBoleta, validarContrasena };
