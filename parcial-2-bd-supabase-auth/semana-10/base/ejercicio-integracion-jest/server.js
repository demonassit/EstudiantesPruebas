// server.js
// Mini API en memoria (sin base de datos real) para practicar pruebas de
// integración con Jest + Supertest — mismo patrón que el login + CRUD
// protegido de esta semana (Corte 2), pero autocontenida. Este archivo es
// el "sistema bajo prueba": no lo modifiques, solo escribe pruebas contra
// él en server.test.js.
const express = require('express');

const app = express();
app.use(express.json());

const USUARIO_VALIDO = { correo: 'admin@cecyt9.ipn.mx', contrasena: 'ClaveSegura123' };
const TOKEN_VALIDO = 'token-de-prueba-fijo';

const talleres = [
  { id: 1, nombre: 'Introducción a Python' },
  { id: 2, nombre: 'Fundamentos de Redes' },
];

// Ruta pública — no requiere sesión/token.
app.get('/api/talleres', (req, res) => {
  res.json(talleres);
});

// Login: si las credenciales coinciden, regresa un token fijo (simplificado
// a propósito — no es JWT real, eso ya se practica en Parcial 3).
app.post('/api/login', (req, res) => {
  const { correo, contrasena } = req.body;
  if (correo === USUARIO_VALIDO.correo && contrasena === USUARIO_VALIDO.contrasena) {
    return res.json({ token: TOKEN_VALIDO });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

function requiereToken(req, res, next) {
  const encabezado = req.headers.authorization;
  if (encabezado === `Bearer ${TOKEN_VALIDO}`) return next();
  res.status(401).json({ error: 'Token requerido' });
}

// Ruta protegida — requiere el token que devuelve /api/login.
app.get('/api/protegido', requiereToken, (req, res) => {
  res.json({ mensaje: 'Acceso concedido' });
});

module.exports = app;

// Solo levanta el servidor si se ejecuta directamente (node server.js);
// al importarlo desde las pruebas (require('./server')) no ocupa un puerto.
if (require.main === module) {
  const PUERTO = process.env.PORT || 3050;
  app.listen(PUERTO, () => console.log(`Servidor de práctica escuchando en el puerto ${PUERTO}`));
}
