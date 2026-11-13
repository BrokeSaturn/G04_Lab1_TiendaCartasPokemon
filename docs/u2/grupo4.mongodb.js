// Hito 2 · Playground del grupo 4 · Tienda de cartas Pokémon
// Base de práctica (distinta de "tiendapokemon", que usa la API con Mongoose)
use("tiendapokemon_lab");
// 0. Limpia para poder ejecutar el archivo varias veces
db.fichas.drop();
db.expansiones.drop();
// 1. createCollection con $jsonSchema: 1 enum, 1 rango y 1 arreglo
db.createCollection("fichas", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["cartaId", "nombre", "numero", "supertipo"],
            properties: {
                cartaId: { bsonType: "number", minimum: 1, description: "id de la carta en PostgreSQL" },
                nombre: { bsonType: "string", minLength: 3 },
                numero: { bsonType: "string", pattern: "^[0-9]{1,3}/[0-9]{1,3}$" },
                supertipo: { enum: ["pokemon", "entrenador", "energia"] }, // ENUM
                hp: { bsonType: "number", minimum: 10, maximum: 400 }, // RANGO
                tipos: { bsonType: "array", items: { bsonType: "string" } }, // ARREGLO
                ataques: {
                    bsonType: "array", // ARREGLO de objetos embebidos
                    maxItems: 4,
                    items: {
                        bsonType: "object",
                        required: ["nombre"],
                        properties: {
                            nombre: { bsonType: "string" },
                            danio: { bsonType: "number", minimum: 0 },
                        },
                    },
                },
                expansion: { bsonType: "string" },
            },
        },
    },
});
// 2. Dos inserts válidos
db.fichas.insertOne({
    cartaId: 1, nombre: "Charizard", numero: "4/102", supertipo: "pokemon", hp: 120,
    tipos: ["fuego"], expansion: "BS",
    ataques: [{ nombre: "Giro Fuego", danio: 100 }],
});
db.fichas.insertOne({
    cartaId: 2, nombre: "Pikachu", numero: "60/64", supertipo: "pokemon", hp: 50,
    tipos: ["electrico"], expansion: "JU",
    ataques: [{ nombre: "Impactrueno", danio: 20 }],
});
// 3. Dos inserts rechazados: se imprime el campo que falló
try {
    db.fichas.insertOne({ cartaId: 3, nombre: "Mewtwo", numero: "10/102", supertipo: "legendario" });
} catch (e) {
    const regla = e.errInfo.details.schemaRulesNotSatisfied[0];
    console.log("Rechazado 1 → campo:", regla.propertiesNotSatisfied[0].propertyName);
}
try {
    db.fichas.insertOne({ cartaId: 3, nombre: "Mewtwo", numero: "10/102", supertipo: "pokemon", hp: 500 });
} catch (e) {
    const regla = e.errInfo.details.schemaRulesNotSatisfied[0];
    console.log("Rechazado 2 → campo:", regla.propertiesNotSatisfied[0].propertyName);
}
// 4. $lookup: cada ficha con los datos de su expansión (+ $unwind para un solo objeto)
db.expansiones.insertMany([
    { codigo: "BS", nombre: "Base Set", anio: 1999, totalCartas: 102 },
    { codigo: "JU", nombre: "Jungle", anio: 1999, totalCartas: 64 },
]);
db.fichas.aggregate([
    {
        $lookup: {
            from: "expansiones", localField: "expansion", foreignField: "codigo", as: "expansionInfo"
        }
    },
    { $unwind: "$expansionInfo" },
    { $project: { _id: 0, nombre: 1, numero: 1, "expansionInfo.nombre": 1, "expansionInfo.anio": 1 } },
]);
