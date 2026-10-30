const { Router } = require("express");
const CartaController = require("../controllers/carta.controller");
const CategoriaController = require("../controllers/categoria.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth");
// RUTAS: conectan cada verbo + URL con una acción del controlador
const router = Router();
const onlyAdmin = [authenticateToken, requireRole("ADMIN")];

router.get("/", CartaController.list);
router.get("/search", CartaController.search);
router.get("/:id", CartaController.getById);
router.post("/", onlyAdmin, CartaController.create);
router.post("/lote", onlyAdmin, CartaController.createMany); // Lab 2: transacción
router.put("/:id", onlyAdmin, CartaController.update);
router.delete("/:id", onlyAdmin, CartaController.remove);
router.put("/:id/categorias", onlyAdmin, CategoriaController.setCategorias); // Taller B

module.exports = router;