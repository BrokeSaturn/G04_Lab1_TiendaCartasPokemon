const { Router } = require("express");
const CartaController = require("../controllers/carta.controller");
// RUTAS: conectan cada verbo + URL con una acción del controlador
const router = Router();
router.get("/", CartaController.list);
router.get("/:id", CartaController.getById);
router.post("/", CartaController.create);
router.post("/lote", CartaController.createMany); // Lab 2: transacción
router.put("/:id", CartaController.update);
router.delete("/:id", CartaController.remove);
module.exports = router;