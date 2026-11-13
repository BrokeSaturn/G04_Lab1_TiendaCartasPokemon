const Ficha = require("../models/ficha.model");
// SERVICIO: usa el modelo, igual que antes usaba prisma.carta.create({ data })
const list = () => Ficha.find();
const create = (data) => Ficha.create(data);
module.exports = { list, create };
