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

-- CreateIndex
CREATE INDEX "historial_pedidos_pedido_id_id_idx" ON "historial_pedidos"("pedido_id", "id");

-- AddForeignKey
ALTER TABLE "historial_pedidos" ADD CONSTRAINT "historial_pedidos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_pedidos" ADD CONSTRAINT "historial_pedidos_cambiado_por_id_fkey" FOREIGN KEY ("cambiado_por_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
