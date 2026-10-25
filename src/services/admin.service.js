const { EstadoPedido } = require("@prisma/client");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");
const { formatPedido } = require("./pedido.service");

//consultas y acciones solo hechas por el admin

const toInt = (value, def, max) => {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n < 1) return def;
  return max ? Math.min(n, max) : n;
};

const parseEstado = (estado) => {
  if (estado === undefined) return undefined;
  const map = {
    CANCELLED: "CANCELADO",
    PENDING: "PENDIENTE",
    PAID: "PAGADO",
    SHIPPED: "ENVIADO",
  };
  const normalized = map[estado] || estado;
  if (!Object.values(EstadoPedido).includes(normalized))
    throw new HttpError(400, `estado debe ser uno de: ${Object.values(EstadoPedido).join(", ")}`);
  return normalized;
};

const parseFecha = (value, campo) => {
  if (value === undefined) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new HttpError(400, `${campo} debe ser una fecha (AAAA-MM-DD)`);
  return d;
};

// Filtros + paginación + orden + conteo en una sola transacción de lectura
const listPedidos = async ({ estado, desde, hasta, page, limit }) => {
  const where = { estado: parseEstado(estado) };
  const gte = parseFecha(desde, "desde");
  const lte = parseFecha(hasta, "hasta");
  if (gte || lte) where.fecha = { gte, lte };

  const take = toInt(limit, 10, 50);
  const pageNum = toInt(page, 1);
  const skip = (pageNum - 1) * take;

  const [total, data] = await prisma.$transaction([
    prisma.pedido.count({ where }),
    prisma.pedido.findMany({
      where,
      include: {
        cliente: { select: { id: true, nombre: true, email: true } },
        items: { include: { carta: { select: { id: true, name: true, price: true } } } },
      },
      orderBy: { fecha: "desc" },
      skip,
      take,
    }),
  ]);
  return { page: pageNum, limit: take, total, pages: Math.ceil(total / take), data: data.map(formatPedido) };
};

const updateEstado = async (id, estado) => {
  if (estado === undefined) throw new HttpError(400, "Envía el nuevo estado");
  // Si el id no existe, Prisma lanza P2025 y errorHandler responde 404
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: parseEstado(estado) },
    include: {
      items: { include: { carta: { select: { id: true, name: true, price: true } } } },
    },
  });
  return formatPedido(updated);
};

// Consulta avanzada: agrupa los ítems por carta y suma las unidades vendidas (sin pedidos cancelados)
const topCartas = async (limit) => {
  const rows = await prisma.pedidoCarta.groupBy({
    by: ["cartaId"],
    _sum: { cantidad: true },
    where: { pedido: { estado: { not: "CANCELADO" } } },
    orderBy: { _sum: { cantidad: "desc" } },
    take: toInt(limit, 5, 20),
  });
  const cartas = await prisma.carta.findMany({
    where: { id: { in: rows.map((r) => r.cartaId) } },
    select: { id: true, name: true },
  });
  const nombre = new Map(cartas.map((c) => [c.id, c.name]));
  return rows.map((r) => ({
    cartaId: r.cartaId,
    productId: r.cartaId,
    name: nombre.get(r.cartaId),
    unidadesVendidas: r._sum.cantidad,
    unitsSold: r._sum.cantidad,
  }));
};

module.exports = { listPedidos, updateEstado, topCartas };
