const { Prisma } = require("@prisma/client");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

// SERVICIO de pedidos: el recurso limitado es el stock (en citas médicas sería el bloque de tiempo)

// Cómo se devuelve un pedido: con sus ítems y el nombre del producto (fetch explícito)
const pedidoInclude = {
  items: { include: { carta: { select: { id: true, name: true, price: true } } } },
};

const statusMap = {
  PENDIENTE: "PENDING",
  PAGADO: "PAID",
  ENVIADO: "SHIPPED",
  CANCELADO: "CANCELLED",
};

const formatPedido = (pedido) => {
  if (!pedido) return pedido;
  const items = pedido.items?.map((it) => ({
    ...it,
    productId: it.cartaId,
    quantity: it.cantidad,
    unitPrice: it.precioUnitario,
    product: it.carta ? { ...it.carta } : undefined,
  }));
  return {
    ...pedido,
    status: statusMap[pedido.estado] || pedido.estado,
    items,
  };
};

const clienteOf = async (userId) => {
  const cliente = await prisma.cliente.findUnique({
    where: { userId },
  });
  if (!cliente) throw new HttpError(403, "El usuario no tiene perfil de cliente");
  return cliente;
};

const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0)
    throw new HttpError(400, "items debe ser un arreglo con al menos un producto");
  const parsed = [];
  for (const [i, it] of items.entries()) {
    const cartaId = it.cartaId ?? it.productId;
    const cantidad = it.cantidad ?? it.quantity;
    if (!Number.isInteger(cartaId) || !Number.isInteger(cantidad) || cantidad < 1)
      throw new HttpError(400, `Ítem ${i + 1}: cartaId y cantidad deben ser enteros y cantidad >= 1`);
    parsed.push({ cartaId, cantidad });
  }
  if (new Set(parsed.map((it) => it.cartaId)).size !== parsed.length)
    throw new HttpError(400, "No repitas el mismo producto: suma las cantidades");
  return parsed;
};

// TRANSACCIÓN: descuenta stock y crea el pedido con sus ítems, o no hace nada
const create = async (userId, rawItems) => {
  const items = normalizeItems(rawItems);
  const cliente = await clienteOf(userId);

  const result = await prisma.$transaction(async (tx) => {
    let total = new Prisma.Decimal(0);
    const lines = [];

    for (const { cartaId, cantidad } of items) {
      const carta = await tx.carta.findUnique({ where: { id: cartaId } });
      if (!carta) throw new HttpError(404, `La carta ${cartaId} no existe`); // ROLLBACK

      // Descuento condicional: si no alcanza el stock, count === 0
      const { count } = await tx.carta.updateMany({
        where: { id: cartaId, stock: { gte: cantidad } },
        data: { stock: { decrement: cantidad } },
      });

      if (count === 0) throw new HttpError(409, `Stock insuficiente: ${carta.name}`); // ROLLBACK

      const precioUnitario = new Prisma.Decimal(carta.price);
      total = total.plus(precioUnitario.times(cantidad));

      lines.push({
        cartaId,
        cantidad,
        precioUnitario,
      });
    }

    return tx.pedido.create({
      data: {
        clienteId: cliente.id,
        total,
        items: { create: lines },
      },
      include: pedidoInclude,
    });
  });

  return formatPedido(result);
};

const listByUser = async (userId) => {
  const cliente = await clienteOf(userId);
  const pedidos = await prisma.pedido.findMany({
    where: { clienteId: cliente.id },
    include: pedidoInclude,
    orderBy: { id: "desc" },
  });
  return pedidos.map(formatPedido);
};

// TRANSACCIÓN: cambia el estado y devuelve el stock de cada ítem
const cancel = async (userId, pedidoId) => {
  const cliente = await clienteOf(userId);

  const result = await prisma.$transaction(async (tx) => {
    const pedido = await tx.pedido.findUnique({
      where: { id: pedidoId },
      include: { items: true },
    });

    if (!pedido) throw new HttpError(404, "Pedido no encontrado");
    if (pedido.clienteId !== cliente.id) throw new HttpError(403, "El pedido no te pertenece");
    if (pedido.estado !== "PENDIENTE")
      throw new HttpError(409, "Solo se puede cancelar un pedido PENDIENTE");

    // Devuelve el stock a cada carta del pedido
    for (const it of pedido.items) {
      await tx.carta.update({
        where: { id: it.cartaId },
        data: { stock: { increment: it.cantidad } },
      });
    }

    return tx.pedido.update({
      where: { id: pedidoId },
      data: { estado: "CANCELADO" },
      include: pedidoInclude,
    });
  });

  return formatPedido(result);
};

module.exports = { create, listByUser, cancel, formatPedido };
