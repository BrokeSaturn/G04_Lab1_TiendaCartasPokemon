-- CreateTable
CREATE TABLE "resenas" (
    "id" SERIAL NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comment" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "carta_id" INTEGER NOT NULL,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_pedidos" (
    "id" SERIAL NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "estado_anterior" "EstadoPedido" NOT NULL,
    "estado_nuevo" "EstadoPedido" NOT NULL,
    "nota" VARCHAR(200),
    "cambiado_por_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartaToCategoria" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CartaToCategoria_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "resenas_user_id_carta_id_key" ON "resenas"("user_id", "carta_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_name_key" ON "categorias"("name");

-- CreateIndex
CREATE INDEX "historial_pedidos_pedido_id_idx" ON "historial_pedidos"("pedido_id");

-- CreateIndex
CREATE INDEX "_CartaToCategoria_B_index" ON "_CartaToCategoria"("B");

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_carta_id_fkey" FOREIGN KEY ("carta_id") REFERENCES "cartas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_pedidos" ADD CONSTRAINT "historial_pedidos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_pedidos" ADD CONSTRAINT "historial_pedidos_cambiado_por_id_fkey" FOREIGN KEY ("cambiado_por_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartaToCategoria" ADD CONSTRAINT "_CartaToCategoria_A_fkey" FOREIGN KEY ("A") REFERENCES "cartas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartaToCategoria" ADD CONSTRAINT "_CartaToCategoria_B_fkey" FOREIGN KEY ("B") REFERENCES "categorias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
