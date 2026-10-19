const { Router } = require("express");
const CartaController = require("../controllers/Carta.controller");

// RUTAS: conectan cada verbo + URL con una acción del controlador
const router = Router();

// ✅ Ya resueltas
router.get("/", CartaController.list);
router.get("/:id", CartaController.getById);

// TODO Paso 2: agrega POST "/" → create, PUT "/:id" → update y DELETE "/:id" → remove

module.exports = router;
