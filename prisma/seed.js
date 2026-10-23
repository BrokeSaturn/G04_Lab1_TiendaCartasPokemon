// Carga datos de prueba sin tocar la base a mano: npx prisma db seed
require("dotenv").config();
const { asyncWrapProviders } = require("node:async_hooks");
const prisma = require("../src/db/prisma"); // el mismo cliente (con adaptador) que usa la API

async function main() {
  // TODO Paso 2:
  // 1. Limpia las tablas con deleteMany() (luego, en el Lab 3, en orden inverso a las relaciones)
  await prisma.carta.deleteMany();
  await prisma.cliente.deleteMany();

  // 2. Inserta al menos 3 registros de la entidad principal y 2 de la segunda entidad con createMany()
  //    Incluye uno cuyo valor @unique uses en Postman para probar el 409 (en el ejemplo: "Café americano")
  await prisma.carta.createMany({
    data:[
      { name: "Charizard", expansion: "Base Set", rarity: "Rare Holo", price: 350.5, stock: 2 },
      { name: "Pikachu", expansion: "Jungle", rarity: "Common", price: 12, stock: 10 },
      { name: "Mewtwo", expansion: "Base Set", rarity: "Rare Holo", price: 120, stock: 4 },
    ],
  });

  await prisma.cliente.createMany({
    data:[
      { nombre: "Jardel Maza", email: "jardel@espe.com", telefono: "0991234567", direccion: "Quito" },
      { nombre: "Esteban Recalde", email: "esteban@espe.com" },
    ],
  });

  // 3. Muestra cuántos registros quedaron con count()
  console.log(`Seed listo: ${await prisma.carta.count()} cartas y ${await prisma.cliente.count()} clientes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
