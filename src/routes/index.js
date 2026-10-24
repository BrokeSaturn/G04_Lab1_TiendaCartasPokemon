const { Router } = require("express");
const pedidoRoutes = require ("./pedido.routes.js")
const CartaRoutes = require("./carta.routes");

// Archivo principal de rutas: cada recurso se monta en su propio prefijo
const router = Router();
router.use("/pedidos", pedidoRoutes)

router.use("/cartas", CartaRoutes); // → /api/cartas · TODO Paso 1: cambia /products por tu entidad

module.exports = router;
