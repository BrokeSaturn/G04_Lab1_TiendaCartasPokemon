const { Router } = require("express");
const CartaController = require("../controllers/carta.controller");

// RUTAS: conectan cada verbo + URL con una acción del controlador
const router = Router();

// ✅ Ya resueltas
    router.get("/", CartaController.list);
    router.get("/:id", CartaController.getById);

// TODO Paso 2: agrega POST "/" → create, PUT "/:id" → update y DELETE "/:id" → remove

<<<<<<< HEAD
module.exports = router; 
=======
    router.post("/", CartaController.create);
    router.put("/:id", CartaController.update);
    router.delete("/:id", CartaController.remove);



module.exports = router;
>>>>>>> e717d916a5b686fc1a20f7faa7b025f3c83ec505
