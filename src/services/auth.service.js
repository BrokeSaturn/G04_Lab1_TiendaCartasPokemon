const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

//Servicio de autenticación: reglas, hash de contraseñas y emisión del JWT
const publicUser = { id: true, email: true, name: true, role: true, cliente: true };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//Validacion, hasheo, creacion de usuario con su perfil de cliente
const register = async ({ email, password, name, phone, direccion }) => {
  if (typeof email !== "string" || !EMAIL_RE.test(email))
    throw new HttpError(400, "El email no es válido");
  if (typeof password !== "string" || password.length < 8)
    throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres");
  if (typeof name !== "string" || name.trim().length < 3)
    throw new HttpError(400, "El nombre es obligatorio y debe tener al menos 3 caracteres");
  const hash = await bcrypt.hash(password, 10);
  // Email repetido → P2002 → errorHandler responde 409
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      name: name.trim(),
      cliente: { create: { nombre: name.trim(), email, telefono: phone || null, direccion: direccion || null } },
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      cliente: true,
    },
  });
  return { ...user, customer: user.cliente };
};

//Login: mismo mensaje si el correo no existe o la clave no coincide (no da pistas)
const login = async ({ email, password }) => {
  if (typeof email !== "string" || typeof password !== "string")
    throw new HttpError(400, "Envía email y password");
  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) throw new HttpError(401, "Correo o contraseña inválidos");
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "4h",
  });
};

const getProfile = async (id) => {
  const user = await prisma.user.findUnique({ where: { id }, select: publicUser });
  if (!user) throw new HttpError(404, "Usuario no encontrado");
  return { ...user, customer: user.cliente };
};

module.exports = { register, login, getProfile };
