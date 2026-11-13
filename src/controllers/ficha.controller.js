const fichaService = require("../services/ficha.service");
// GET /api/fichas → 200
const list = async (req, res, next) => {
    try {
        res.json(await fichaService.list());
    } catch (err) {
        next(err);
    }
};
// POST /api/fichas → 201 con el documento (y el virtual). Si falla la validación, errorHandler responde
400
const create = async (req, res, next) => {
    try {
        const ficha = await fichaService.create(req.body ?? {});
        res.status(201).json(ficha);
    } catch (err) {
        next(err);
    }
};
module.exports = { list, create };