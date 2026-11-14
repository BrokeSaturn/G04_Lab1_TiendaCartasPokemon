# Hito 1 · ¿Qué dato de nuestro emprendimiento va a NoSQL?

**Grupo:** G04  **Emprendimiento:** Tienda de cartas Pokémon

| Dato | ¿Por qué no encaja bien en una tabla? | Tipo NoSQL | Razón |
|---|---|---|---|
| Ficha técnica de cada carta (HP, tipos, ataques, efecto) | Cada supertipo trae campos distintos: un Pokémon tiene HP y ataques; un Entrenador solo un efecto; una Energía solo su tipo. En SQL quedarían muchas columnas vacías o varias tablas. | Documental | Cada ficha es un documento con solo los campos que necesita, y los ataques van embebidos dentro. |
| Carrito de compras del cliente | Es temporal, cambia en cada clic y siempre se busca por el usuario. | Clave-valor | Se guarda con la clave carrito:idUsuario y se lee o escribe en una sola operación; puede expirar solo. |
| Historial de precios de mercado de cada carta | Un registro por carta por día: crece sin límite y se consulta por carta y rango de fechas. | Columnar | Guarda muchas filas por carta ordenadas por fecha y lee rangos de fechas muy rápido. |

**Colección elegida:** `fichas` (documental, MongoDB)

```json
{
  "cartaId": 1,
  "nombre": "Charizard",
  "numero": "4/102",
  "supertipo": "pokemon",
  "hp": 120,
  "tipos": ["fuego"],
  "expansion": "BS",
  "ataques": [
    { "nombre": "Giro Fuego", "danio": 100, "costo": ["fuego", "fuego", "fuego", "fuego"] }
  ]
}
```

**Se queda en PostgreSQL:** users, clientes, cartas (precio y stock), pedidos, pedido_cartas, reseñas, categorías e historial de pedidos. Son datos con relaciones fijas, llaves foráneas, campos únicos y transacciones (crear un pedido descuenta stock), que es justo lo que resuelve una base relacional. La ficha solo guarda `cartaId` para saber a qué carta de PostgreSQL pertenece; precio y stock no se repiten en MongoDB.