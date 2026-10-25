const pedidoService = require("../services/pedido.service");
const HttpError = require("../utils/httpError");

const parseId = (req) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) throw new HttpError(400, "El id debe ser numérico");
  return id;
};

const getUserId = (req) => {
  const userId = req.user?.id || req.user?.userId;
  if (!userId) throw new HttpError(401, "Usuario no autenticado correctamente");
  return userId;
};

// POST /api/orders → crea el pedido del usuario autenticado
const create = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const items = req.body?.items;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "El pedido debe contener una lista de ítems");
    }

    const nuevoPedido = await pedidoService.create(userId, items);
    res.status(201).json(nuevoPedido);
  } catch (err) {
    next(err);
  }
};



// GET /api/orders → pedidos del usuario con sus ítems y productos
const listMine = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    res.json(await pedidoService.listByUser(userId));
  } catch (err) {
    next(err);
  }
};

// PATCH /api/pedidos/:id/cancelar → cancela y devuelve el stock
const cancel = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const pedidoId = parseId(req);
    
    // NOTA: Asegura el orden de parámetros (userId, pedidoId) según tu pedido.service.js
    const pedidoCancelado = await pedidoService.cancel(userId, pedidoId);
    res.json(pedidoCancelado);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, listMine, cancel };
