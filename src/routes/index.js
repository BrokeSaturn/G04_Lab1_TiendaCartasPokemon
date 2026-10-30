const { Router } = require("express");
const authRoutes = require("./auth.routes");
const pedidoRoutes = require("./pedido.routes");
const CartaRoutes = require("./carta.routes");
const adminRoutes = require("./admin.routes");
const categoriaRoutes = require("./categoria.routes"); // Taller B

// Archivo principal de rutas: cada recurso se monta en su propio prefijo
const router = Router();
router.use("/auth", authRoutes);
router.use("/pedidos", pedidoRoutes);
router.use("/orders", pedidoRoutes);
router.use("/cartas", CartaRoutes);
router.use("/products", CartaRoutes);
router.use("/admin", adminRoutes);
router.use("/categorias", categoriaRoutes); // Taller B

module.exports = router;
