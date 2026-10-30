const { Router } = require("express");
const categoriaController = require("../controllers/categoria.controller");
const { authenticateToken, requireRole } = require("../middlewares/auth");
// Se monta en /api/categorias (routes/index.js)
const router = Router();
router.get("/", categoriaController.list); // público
router.post("/", authenticateToken, requireRole("ADMIN"), categoriaController.create);
module.exports = router;