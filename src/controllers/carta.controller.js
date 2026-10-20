const cartaservice = require("../services/carta.service");
const HttpError = require("../utils/httpError");

// CONTROLADOR: lee la petición (params, body), llama al servicio y decide código + JSON.
// No lee archivos ni valida reglas de negocio. Los errores van a next(err) → errorHandler.

const parseId = (req) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) throw new HttpError(400, "El id debe ser numérico");
  return id;
};

// ✅ Ya resuelto: GET / → 200
const list = async (req, res, next) => {
  try {
    res.json(await cartaservice.list()); // 200
  } catch (err) {
    next(err);
  }
};

// ✅ Ya resuelto: GET /:id → 200 (el servicio lanza 404 si no existe)
const getById = async (req, res, next) => {
  try {
    res.json(await cartaservice.getById(parseId(req))); // 200
  } catch (err) {
    next(err);
  }
};

// TODO Paso 2: POST / → llama a cartaservice.create(req.body ?? {}) y responde 201 con el registro
const create = async (req, res, next) => {
  try {
    const carta = await cartaservice.create(req.body ?? {});
    res.status(201).json(carta); // 201 Created
  } catch (err) {
    next(err);
  }
};

// TODO Paso 2: PUT /:id → llama a cartaservice.update(parseId(req), req.body ?? {}) y responde 200
const update = async (req, res, next) => {
  try {
    const carta = await cartaservice.update(parseId(req), req.body ?? {});
    res.json(carta); // 200 OK
  } catch (err) {
    next(err);
  }
};

// TODO Paso 2: DELETE /:id → llama a cartaservice.remove(parseId(req)) y responde 204 sin cuerpo (res.status(204).end())
const remove = async (req, res, next) => {
  try {
    await cartaservice.remove(parseId(req));
    res.status(204).end(); // 204 No Content
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
