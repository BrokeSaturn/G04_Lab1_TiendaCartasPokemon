const { Router } = require("express");
const authRoutes = require("./auth.routes");
const pedidoRoutes = require ("./pedido.routes.js");
const CartaRoutes = require("./carta.routes");
const adminRoutes = require("./admin.routes")


// Archivo principal de rutas: cada recurso se monta en su propio prefijo
const router = Router();
router.use("/auth", authRoutes);
router.use("/pedidos", pedidoRoutes)
router.use("/cartas", CartaRoutes); // → /api/cartas · TODO Paso 1: cambia /products por tu entidad
router.use("/admin", adminRoutes);

module.exports = router;
