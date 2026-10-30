// Carga datos de prueba sin tocar la base a mano: npx prisma db seed (se puede ejecutar varias veces)
require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("../src/db/prisma"); // el mismo cliente (con adaptador) que usa la API
async function main() {
  // 1. Limpia en orden inverso a las relaciones (hijos antes que padres)
  await prisma.pedidoCarta.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.user.deleteMany();
  await prisma.carta.deleteMany();
  await prisma.categoria.deleteMany();
  // 2. Catálogo
  await prisma.carta.createMany({
    data: [
      { name: "Charizard", expansion: "Base Set", rarity: "Rare Holo", price: 350.5, stock: 2 },
      { name: "Pikachu", expansion: "Jungle", rarity: "Common", price: 12, stock: 10 },
      { name: "Mewtwo", expansion: "Base Set", rarity: "Rare Holo", price: 120, stock: 4 },
    ],
  });

  // Taller B: categorías conectadas a las cartas (N:M implícita)  ← después del createMany
  await prisma.categoria.create({ data: { name: "Fuego", cartas: { connect: [{ name: "Charizard" }] } } });
  await prisma.categoria.create({ data: { name: "Eléctrico", cartas: { connect: [{ name: "Pikachu" }] } } });
  await prisma.categoria.create({ data: { name: "Psíquico", cartas: { connect: [{ name: "Mewtwo" }] } } });

  // 3. Administrador (sin perfil de cliente) y usuarios con perfil 1:1 en una escritura anidada
  await prisma.user.create({
    data: {
      email: "admin@tiendapokemon.com",
      password: await bcrypt.hash("Admin123*", 10),
      name: "Administración",
      role: "ADMIN",
    },
  });
  const jardel = await prisma.user.create({
    data: {
      email: "jardel@espe.com",
      password: await bcrypt.hash("Cliente123*", 10),
      name: "Jardel Maza",
      cliente: {
        create: { nombre: "Jardel Maza", email: "jardel@espe.com", telefono: "0991234567", direccion: "Quito" },
      },
    },
    include: { cliente: true },
  });
  await prisma.user.create({
    data: {
      email: "esteban@espe.com",
      password: await bcrypt.hash("Cliente123*", 10),
      name: "Esteban Recalde",
      cliente: { create: { nombre: "Esteban Recalde", email: "esteban@espe.com" } },
    },
  });
  // 4. Un pedido de ejemplo (1:N con Cliente y N:M con Carta)
  const mewtwo = await prisma.carta.findUnique({ where: { name: "Mewtwo" } });
  await prisma.pedido.create({
    data: {
      clienteId: jardel.cliente.id,
      total: 240,
      estado: "ENVIADO",
      items: { create: [{ cartaId: mewtwo.id, cantidad: 2, precioUnitario: mewtwo.price }] },
    },
  });
  console.log(
    `Seed listo: ${await prisma.carta.count()} cartas, ${await prisma.user.count()} usuarios, ` +
      `${await prisma.cliente.count()} clientes y ${await prisma.pedido.count()} pedidos`
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
