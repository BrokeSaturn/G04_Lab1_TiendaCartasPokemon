const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

// SERVICIO de reseñas (Taller · Tarjeta A): validaciones, 404, 409, 403 y consultas con Prisma

// 404 si la carta no existe
const existeCarta = async (cartaId) => {
  const carta = await prisma.carta.findUnique({ where: { id: cartaId } });
  if (!carta) throw new HttpError(404, "Carta no encontrada");
};

// POST /api/cartas/:id/resenas
const create = async (userId, cartaId, { rating, comment }) => {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    throw new HttpError(400, "rating debe ser un entero de 1 a 5");
  if (comment !== undefined && (typeof comment !== "string" || comment.length > 300))
    throw new HttpError(400, "comment debe ser texto de máximo 300 caracteres");

  await existeCarta(cartaId);

  // @@unique([userId, cartaId]) → Prisma crea la clave compuesta userId_cartaId
  const yaExiste = await prisma.resena.findUnique({ where: { userId_cartaId: { userId, cartaId } } });
  if (yaExiste) throw new HttpError(409, "Ya reseñaste esta carta");

  return prisma.resena.create({ data: { rating, comment, userId, cartaId } });
};

// GET /api/cartas/:id/resenas?page&limit → promedio con aggregate y lista paginada
const listByCarta = async (cartaId, { page, limit }) => {
  await existeCarta(cartaId);

  const pageNum = Math.max(Number.parseInt(page, 10) || 1, 1);
  const take = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 50);

  const [stats, data] = await prisma.$transaction([
    prisma.resena.aggregate({ where: { cartaId }, _avg: { rating: true }, _count: { _all: true } }),
    prisma.resena.findMany({
      where: { cartaId },
      include: { user: { select: { name: true } } }, // nombre del autor, sin contraseña
      orderBy: { createdAt: "desc" }, // más recientes primero
      skip: (pageNum - 1) * take,
      take,
    }),
  ]);

  const total = stats._count._all;
  return {
    cartaId,
    average: stats._avg.rating ?? 0,
    total,
    page: pageNum,
    limit: take,
    pages: Math.ceil(total / take),
    data,
  };
};

// DELETE /api/resenas/:id → solo el autor o un ADMIN
const remove = async (user, id) => {
  const resena = await prisma.resena.findUnique({ where: { id } });
  if (!resena) throw new HttpError(404, "Reseña no encontrada");
  if (resena.userId !== user.id && user.role !== "ADMIN")
    throw new HttpError(403, "Solo el autor o un ADMIN puede eliminar la reseña");
  await prisma.resena.delete({ where: { id } });
};

module.exports = { create, listByCarta, remove };