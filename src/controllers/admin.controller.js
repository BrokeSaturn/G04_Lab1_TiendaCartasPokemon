const adminService = require("../services/admin.service");
const HttpError = require("../utils/httpError");

//Get
const listPedidos = async (req, res, next)=>{
    try {
        res.json(await adminService.listPedidos(req.query));
    } catch (error) {
        next(error);
    }
};
// Taller C: PATCH /api/admin/pedidos/:id/estado (200)
const cambiarEstado = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) throw new HttpError(400, "El id debe ser numérico");

    res.json(await adminService.cambiarEstado(id, req.body?.estado, req.body?.nota, req.user.id));
  } catch (error) {
    next(error);
  }
};


//get

const topCartas = async(req,res,next)=>{
    try {
        res.json(await adminService.topCartas(req.query.limit));
    } catch (error) {
        next(error);
    }
};

module.exports ={listPedidos, cambiarEstado, topCartas};