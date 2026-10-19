const Carta = require("../models/carta.model");
const HttpError = require("../utils/httpError");

// SERVICIO: reglas de negocio y acceso a datos a través del modelo.
// Lanza HttpError (400, 404) cuando una regla no se cumple. En el Lab 2 este archivo
// usará Prisma; el controlador y las rutas no cambian.

// Devuelve un mensaje de error o null si los datos son válidos.
// partial = true en PUT: valida solo los campos que llegan.
// TODO Paso 1: al menos 2 validaciones de TU entidad.
const validate = (data, { partial = false } = {}) => {
 const has = (k) => data[k] !== undefined;
  if (!partial || has("name")) {
    if (typeof data.name !== "string" || data.name.trim().length < 3)
      return "El nombre es obligatorio y debe tener al menos 3 caracteres";
  }
  if (!partial || has("price")) {
    if (typeof data.price !== "number" || data.price < 0)
      return "El precio debe ser un número mayor o igual a 0";
  }
  if (!partial || has("stock")) {
    if (!Number.isInteger(data.stock) || data.stock < 0)
      return "El stock debe ser un número entero mayor o igual a 0";
  }
  return null;
};

// ✅ Ya resuelto: úsalo como guía
const list = () => Carta.readAll();

// ✅ Ya resuelto
const getById = async (id) => {
  const item = (await Carta.readAll()).find((p) => p.id === id);
  if (!item) throw new HttpError(404, "Carta no encontrada");
  return item;
};

// TODO Paso 2: valida (400), genera el id (máximo + 1), agrega el registro con carta.pick, guarda y devuélvelo
const create = async (data) => {
  const error = validate(data);
  if (error) throw new HttpError(400, error);
  const items = await Carta.readAll();
  const id = items.length ? Math.max(...items.map((c) => c.id)) + 1 : 1;
  const item = { id, ...Carta.pick(data) };
  items.push(item);
  await Carta.writeAll(items);
  return item;
};

// TODO Paso 2: valida con { partial: true } (400); si el id no existe lanza 404; mezcla los campos, guarda y devuélvelo
const update = async (id, data) => {
   const error = validate(data, { partial: true });
  if (error) throw new HttpError(400, error);
  const items = await Carta.readAll();
  const index = items.findIndex((c) => c.id === id);
  if (index === -1) throw new HttpError(404, "Carta no encontrada");
  items[index] = { ...items[index], ...Carta.pick(data) };
  await Carta.writeAll(items);
  return items[index];
};

// TODO Paso 2: elimina por id; si no existía lanza 404
const remove = async (id) => {
   const items = await Carta.readAll();
  const rest = items.filter((c) => c.id !== id);
  if (rest.length === items.length) throw new HttpError(404, "Carta no encontrada");
  await Carta.writeAll(rest);
};

module.exports = { list, getById, create, update, remove };
