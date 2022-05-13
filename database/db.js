require("dotenv").config();
const mongoose = require("mongoose");

const clientDB = mongoose
       .connect(process.env.URI, {}) 
       .then((m) => {
                     console.log("Base de Datos Conectada")
                     return m.connection.getClient();
              })
       .catch((e) => console.log("error de conexion: " + e));


module.exports = clientDB;       