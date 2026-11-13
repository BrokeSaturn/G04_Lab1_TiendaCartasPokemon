const { Router } = require("express");
const FichaController = require("../controllers/ficha.controller");
const router = Router();
router.get("/", FichaController.list);
router.post("/", FichaController.create);
module.exports = router;