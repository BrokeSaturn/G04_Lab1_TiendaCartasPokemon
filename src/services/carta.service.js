const { serializeJsonQuery } = require("@prisma/client/runtime/client");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

// SERVICIO: reglas de negocio y acceso a datos a través del modelo.
// Lanza HttpError (400, 404) cuando una regla no se cumple. En el Lab 2 este archivo
// usará Prisma; el controlador y las rutas no cambian.

const FIELDS = ["name", "expansion", "rarity", "price", "stock"];

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

const pick = (data) =>
  Object.fromEntries(FIELDS.filter((k) => data[k] !== undefined).map((k) => [k, data[k]]));

// ✅ Ya resuelto: úsalo como guía
const list = () => prisma.carta.findMany({ orderBy: { id: "asc" } });

// ✅ Ya resuelto 
const getById = async (id) => {
  const item = await prisma.carta.findUnique({ where: { id } });
  if (!item) throw new HttpError(404, "Carta no encontrada");
  return item;
};

// TODO Paso 2: valida (400), genera el id (máximo + 1), agrega el registro con carta.pick, guarda y devuélvelo
const create = async (data) => {
  const error = validate(data);
  if (error) throw new HttpError(400, error);
  return prisma.carta.create({ data: pick(data) });
};

// TODO Paso 2: valida con { partial: true } (400); si el id no existe lanza 404; mezcla los campos, guarda y devuélvelo
const update = async (id, data) => {
  const error = validate(data, { partial: true });
  if (error) throw new HttpError(400, error);
  await getById(id); // 404 si no existe
  return prisma.carta.update({ where: { id }, data: pick(data) });
};

// TODO Paso 2: elimina por id; si no existía lanza 404
const remove = async (id) => {
  const { count } = await prisma.carta.deleteMany({ where: { id } });
  if (count === 0) throw new HttpError(404, "Carta no encontrada");
};

// TRANSACCIÓN: crea todas las cartas o ninguna. Dentro se usa tx, no prisma.
const createMany = (items) =>
  prisma.$transaction(async (tx) => {
    const created = [];
    for (const [i, data] of items.entries()) {
      const error = validate(data ?? {});
      if (error) throw new HttpError(400, `Ítem ${i + 1}: ${error}`); // → ROLLBACK
      created.push(await tx.carta.create({ data: pick(data) }));
    }
    return created; 
  });

  // Taller B · búsqueda: filtros combinables, orden dinámico y paginación
const SORTS = { price_asc: { price: "asc" }, price_desc: { price: "desc" }, name: { name: "asc" } };
const search = async ({ q, category, min, max, sort, page, limit }) => {
  if (sort !== undefined && !SORTS[sort])
    throw new HttpError(400, "sort debe ser price_asc, price_desc o name");
  const where = {};
  if (q) where.name = { contains: q, mode: "insensitive" }; // sin distinguir mayúsculas
  if (category) where.categorias = { some: { name: { equals: category, mode: "insensitive" } } };
  if (min !== undefined || max !== undefined) where.price = {};
  if (min !== undefined) where.price.gte = Number(min);
  if (max !== undefined) where.price.lte = Number(max);
  const pageNum = Math.max(Number.parseInt(page, 10) || 1, 1);
  const take = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);
  const [total, data] = await prisma.$transaction([
    prisma.carta.count({ where }),
    prisma.carta.findMany({
      where,
      include: { categorias: true },
      orderBy: SORTS[sort] ?? { id: "asc" },
      skip: (pageNum - 1) * take,
      take,
    }),
  ]);
  return { page: pageNum, limit: take, total, pages: Math.ceil(total / take), data };
};
module.exports = { list, getById, create, update, remove, createMany, search };