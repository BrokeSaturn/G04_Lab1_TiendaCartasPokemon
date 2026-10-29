const { Router } = require("express");
const resenaController = require("../controllers/resena.controller");
const { authenticateToken } = require("../middlewares/auth");

// Se monta SIN prefijo en routes/index.js: cada ruta lleva su camino completo.
// Por eso el token se pide ruta por ruta (aquí NO va router.use(authenticateToken)).
const router = Router();

router.post("/cartas/:id/resenas", authenticateToken, resenaController.create);
router.get("/cartas/:id/resenas", resenaController.list); // público
router.delete("/resenas/:id", authenticateToken, resenaController.remove);

module.exports = router;