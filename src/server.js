require("dotenv").config();
const app = require("./app");
const prisma = require("./db/prisma");
const connectMongo = require("./db/mongo");
const PORT = process.env.PORT || 3000;
const start = async () => {
  if (!process.env.JWT_SECRET) throw new Error("Falta la variable JWT_SECRET");
  if (!process.env.MONGODB_URI) throw new Error("Falta la variable MONGODB_URI");
  await prisma.$connect();
  await connectMongo(); // si falla, salta al catch y no se llama a listen
  app.listen(PORT, () =>
    console.log(`Servidor ejecutándose en http://localhost:${PORT} - PostgreSQL y MongoDB conectados`)
  );
};
start().catch((err) => {
  console.error("No se pudo iniciar la API:", err.message);
  process.exit(1);
});
