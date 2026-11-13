const mongoose = require("mongoose");
// Ataque: va EMBEBIDO en la ficha (se lee junto, son pocos y casi no cambian)
const ataqueSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, "El nombre del ataque es obligatorio"] },
    danio: { type: Number, min: [0, "El daño no puede ser negativo"] },
    costo: [String],
  },
  { _id: false }
);
const fichaSchema = new mongoose.Schema(
  {
    cartaId: {
      type: Number,
      required: [true, "El cartaId (id de la carta en PostgreSQL) es obligatorio"],
      min: [1, "El cartaId debe ser mayor o igual a 1"],
    },
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    },
    numero: {
      type: String,
      required: [true, "El número de la carta es obligatorio"],
      match: [/^\d{1,3}\/\d{1,3}$/, "El número debe tener el formato 4/102"],
    },
    supertipo: {
      type: String,
      required: [true, "El supertipo es obligatorio"],
      enum: {
         values: ["pokemon", "entrenador", "energia"],
        message: "El supertipo {VALUE} no es válido (pokemon, entrenador o energia)",
      },
    },
    hp: {
      type: Number,
      min: [10, "El HP mínimo es 10"],
      max: [400, "El HP máximo es 400"],
      // Validación propia: en el juego el HP siempre es múltiplo de 10
      validate: {
        validator: (v) => v % 10 === 0,
        message: (p) => `El HP ${p.value} debe ser múltiplo de 10`,
      },
    },
    tipos: [String],
    ataques: [ataqueSchema],
    expansion: String, // código de la expansión, ej. "BS" (se une con $lookup en el playground)
    slug: String, // lo llena el pre("validate")
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
// Virtual: no se guarda en MongoDB, se calcula al responder
fichaSchema.virtual("resumen").get(function () {
  return `${this.nombre} ${this.numero} - ${this.ataques.length} ataque(s)`;
});
// Middleware de Mongoose: trabaja con el documento (this). Mongoose 9: sin next
fichaSchema.pre("validate", function () {
  if (this.nombre && this.numero) {
    this.slug = this.nombre.toLowerCase().replaceAll(" ", "-") + "-" + this.numero.replace("/", "-");
  }
  this.tipos = this.tipos.map((t) => t.trim().toLowerCase());
});
module.exports = mongoose.model("Ficha", fichaSchema);