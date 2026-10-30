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

// Taller C: Transiciones válidas
const TRANSICIONES = {
  PENDIENTE: ["PAGADO", "CANCELADO"],
  PAGADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: [],
  CANCELADO: [],
};

// TRANSACCIÓN: el cambio de estado y el registro en el historial se guardan juntos o ninguno
const cambiarEstado = async (pedidoId, estado, nota, adminId) => {
  if (estado === undefined) throw new HttpError(400, "Envía el nuevo estado");
  
  const nuevo = parseEstado(estado); // 400 si no es un estado válido

  if (nota !== undefined && (typeof nota !== "string" || nota.length > 200)) {
    throw new HttpError(400, "nota debe ser texto de máximo 200 caracteres");
  }

  const result = await prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.findUnique({
      where: { id: pedidoId },
      include: { items: true },
    });

    if (!pedido) throw new HttpError(404, "Pedido no encontrado");

    if (!TRANSICIONES[pedido.estado].includes(nuevo)) {
      throw new HttpError(409, `Transición no permitida: ${pedido.estado} -> ${nuevo}`);
    }

    // updateMany condicionado al estado que leímos: control de concurrencia
    const { count } = await tx.pedido.updateMany({
      where: { id: pedidoId, estado: pedido.estado },
      data: { estado: nuevo },
    });

    if (count === 0) {
      throw new HttpError(409, "El pedido cambió de estado mientras tanto"); // ROLLBACK
    }

    // Si se cancela, se devuelve el stock de cada carta
    if (nuevo === "CANCELADO") {
      for (const it of pedido.items) {
        await tx.carta.update({
          where: { id: it.cartaId },
          data: { stock: { increment: it.cantidad } },
        });
      }
    }

    await tx.historialPedido.create({
      data: {
        pedidoId,
        estadoAnterior: pedido.estado,
        estadoNuevo: nuevo,
        nota,
        cambiadoPorId: adminId,
      },
    });

    return tx.pedido.findUnique({
      where: { id: pedidoId },
      include: {
        items: {
          include: {
            carta: { select: { id: true, name: true, price: true } },
          },
        },
      },
    });
  });

  return formatPedido(result);
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

module.exports = { listPedidos, cambiarEstado, topCartas };
