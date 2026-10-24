const { Prisma } = require ("@prisma/client");
const prisma = require("../db/prisma");
const HttpError = require("../utils/httpError");

// SERVICIO de pedidos: el recurso limitado es el stock (en citas médicas sería el bloque de tiempo)

// Cómo se devuelve un pedido: con sus ítems y el nombre del producto (fetch explícito)
const pedidoInclude = {
  items: { include: { carta: { select: { id: true, name: true } } } },
};

const clienteOf = async (userId) => {
  const cliente = await prisma.cliente.findUnique({ where: { userId } });
  if (!cliente) throw new HttpError(403, "El usuario no tiene perfil de cliente");
  return cliente;
};

const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0)
    throw new HttpError(400, "items debe ser un arreglo con al menos un producto");
  for (const [i, it] of items.entries()) {
    if (!Number.isInteger(it.cartaId) || !Number.isInteger(it.cantidad) || it.cantidad < 1)
      throw new HttpError(400, `Ítem ${i + 1}: cartaId y cantidad deben ser enteros y cantidad >= 1`);
  }
  if (new Set(items.map((it) => it.cartaId)).size !== items.length)
    throw new HttpError(400, "No repitas el mismo producto: suma las cantidades");
};

// TRANSACCIÓN: descuenta stock y crea el pedido con sus ítems, o no hace nada
// TODO Paso 3 · TRANSACCIÓN (clase «Servicios y controladores para gestión de reservas»):
// 1. validateItems(items) y customerOf(userId)
// 2. prisma.$transaction(async (tx) => { ... }) y, por cada ítem:
//    - tx.product.updateMany({ where: { id, stock: { gte: quantity } }, data: { stock: { decrement: quantity } } })
//    - si el producto no existe → 404; si count === 0 → 409 «Stock insuficiente» (ROLLBACK)
//    - acumula total y la línea { productId, quantity, unitPrice: product.price }
// 3. tx.order.create({ data: { customerId, total, items: { create: lines } }, include: orderInclude })
const create = async (userId, items) => {
  validateItems(items);
  const cliente = await clienteOf(userId);

  return prisma.$transaction(async (tx) => {
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

      total = total.plus(carta.price.times(cantidad));
      lines.push({ cartaId, cantidad, precioUnitario: carta.price });
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

};

const listByUser = async (userId) => {
  const cliente = await clienteOf(userId);
  return prisma.pedido.findMany({
    where: { clienteId: cliente.id },
    include: pedidoInclude,
    orderBy: { fecha: "desc" },
  });
};

// TRANSACCIÓN: cambia el estado y devuelve el stock de cada ítem
// TODO Paso 3 · TRANSACCIÓN: busca el pedido con sus ítems (404), verifica que sea del cliente (403)
// y que esté PENDING (409). Devuelve el stock de cada ítem con increment y cambia status a CANCELLED.
const cancel = async (userId, pedidoId) => {
  const cliente = await clienteOf(userId);

  return prisma.$transaction(async (tx) => {
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
};

module.exports = { create, listByUser, cancel };
