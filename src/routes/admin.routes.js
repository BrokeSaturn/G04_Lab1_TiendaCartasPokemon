const {Router} = require("express");
const adminController = require("../controllers/admin.controller");
const {authenticateToken, requireRole} = require("../middlewares/auth");

// Módulo de administración: un solo lugar con la protección de rol
const router = Router();
router.use(authenticateToken, requireRole("ADMIN"));

// Rutas para operaciones de administración
router.get("/pedidos", adminController.listPedidos);
router.patch("/pedidos/:id", adminController.updateEstado);
router.get("/cartas/top", adminController.topCartas);

module.exports = router;