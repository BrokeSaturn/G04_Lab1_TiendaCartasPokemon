const categoriaService = require("../services/categoria.service");
const HttpError = require("../utils/httpError");
// CONTROLADOR de categorías: lee req, llama al servicio y decide el código HTTP
// POST /api/categorias → 201
const create = async (req, res, next) => {
  try {
    res.status(201).json(await categoriaService.create(req.body ?? {}));
  } catch (err) {
    next(err);
  }
};
// GET /api/categorias → 200
const list = async (req, res, next) => {
  try {
    res.json(await categoriaService.list());
  } catch (err) {
    next(err);
  }
};
// PUT /api/cartas/:id/categorias → 200
const setCategorias = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new HttpError(400, "El id debe ser numérico");
    res.json(await categoriaService.setCategorias(id, req.body?.categoriaIds));
  } catch (err) {
    next(err);
  }
};
module.exports = { create, list, setCategorias };