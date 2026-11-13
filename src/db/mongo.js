const mongoose = require("mongoose");
// Mongoose 9: solo await connect(uri), sin callback ni useNewUrlParser
const connectMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB conectado");
};
module.exports = connectMongo;