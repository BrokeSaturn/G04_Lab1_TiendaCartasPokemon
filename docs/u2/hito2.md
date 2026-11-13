# Hito 2 · Workload y modelo documental

**Grupo:** ______  **Emprendimiento:** ______  **Colección elegida (hito 1):** ______

## 1. Workload

| Actor | Operación | Lectura o escritura | Frecuencia (por día/hora) | Datos que usa |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

## 2. Relaciones: embeber o referenciar

| Relación | Cardinalidad | ¿Se lee junto? | ¿Cambia seguido? | ¿Crece sin límite? | Decisión |
|---|---|---|---|---|---|
| | 1:1 / 1:N / N:M | | | | Embebida / Referenciada |
| | | | | | |

## 3. ER de MongoDB

Lo embebido se dibuja DENTRO de la entidad (`campo[]`); lo referenciado, como caja aparte unida con una línea (`*_id`).

## 4. Playground (`grupoN.mongodb.js`)

- [ ] `createCollection` con `$jsonSchema`: 1 `enum`, 1 rango (`minimum`/`maximum`) y 1 arreglo
- [ ] 2 inserts válidos y 2 rechazados (con el mensaje)
- [ ] `$lookup` entre dos colecciones
