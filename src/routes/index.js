const { Router } = require("express");
const CartaRoutes = require("./Carta.routes");

// Archivo principal de rutas: cada recurso se monta en su propio prefijo
const router = Router();

router.use("/cartas", CartaRoutes); // → /api/cartas · TODO Paso 1: cambia /products por tu entidad

module.exports = router;
