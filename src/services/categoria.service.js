const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");
// SERVICIO de categorías (Taller · Tarjeta B): N:M implícita con Carta
// POST /api/categorias
const create = async ({ name }) => {
  if (typeof name !== "string" || name.trim().length === 0 || name.trim().length > 50)
    throw new HttpError(400, "name es obligatorio (máximo 50 caracteres)");
  const existe = await prisma.categoria.findUnique({ where: { name: name.trim() } });
  if (existe) throw new HttpError(409, "La categoría ya existe");
  return prisma.categoria.create({ data: { name: name.trim() } });
};
// GET /api/categorias → cada categoría con el número de cartas (_count)
const list = () =>
  prisma.categoria.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { cartas: true } } },
  });
// PUT /api/cartas/:id/categorias → reemplaza las categorías de la carta con set
const setCategorias = async (cartaId, categoriaIds) => {
  if (!Array.isArray(categoriaIds) || !categoriaIds.every(Number.isInteger))
    throw new HttpError(400, "categoriaIds debe ser un arreglo de enteros");
  const carta = await prisma.carta.findUnique({ where: { id: cartaId } });
  if (!carta) throw new HttpError(404, "Carta no encontrada");
  const encontradas = await prisma.categoria.count({ where: { id: { in: categoriaIds } } });
  if (encontradas !== new Set(categoriaIds).size) throw new HttpError(404, "Alguna categoría no existe");
  return prisma.carta.update({
    where: { id: cartaId },
    data: { categorias: { set: categoriaIds.map((id) => ({ id })) } }, // set: quita las anteriores y pone estas
    include: { categorias: true },
  });
};
module.exports = { create, list, setCategorias };