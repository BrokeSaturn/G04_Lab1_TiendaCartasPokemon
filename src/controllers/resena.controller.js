const resenaService = require("../services/resena.service");
const HttpError = require("../utils/httpError");

// CONTROLADOR de reseñas: lee req, llama al servicio y decide el código HTTP

const parseId = (req) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) throw new HttpError(400, "El id debe ser numérico");
  return id;
};

// POST /api/cartas/:id/resenas → 201
const create = async (req, res, next) => {
  try {
    res.status(201).json(await resenaService.create(req.user.id, parseId(req), req.body ?? {}));
  } catch (err) {
    next(err);
  }
};

// GET /api/cartas/:id/resenas → 200
const list = async (req, res, next) => {
  try {
    res.json(await resenaService.listByCarta(parseId(req), req.query));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/resenas/:id → 204
const remove = async (req, res, next) => {
  try {
    await resenaService.remove(req.user, parseId(req));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

module.exports = { create, list, remove };