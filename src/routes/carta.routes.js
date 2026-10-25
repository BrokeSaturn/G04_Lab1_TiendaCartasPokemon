const { Router } = require("express");
const CartaController = require("../controllers/carta.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth");
// RUTAS: conectan cada verbo + URL con una acción del controlador
const router = Router();
const onlyAdmin = [authenticateToken, requireRole("ADMIN")];

router.get("/", CartaController.list);
router.get("/:id", CartaController.getById);
router.post("/", onlyAdmin, CartaController.create);
router.post("/lote", onlyAdmin, CartaController.createMany); // Lab 2: transacción
router.put("/:id", onlyAdmin, CartaController.update);
router.delete("/:id", onlyAdmin, CartaController.remove);

module.exports = router;