const express = require("express");
const app = express();
const port = 5000;
const { create } = require("express-handlebars");

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");


app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));



app.use(express.static(__dirname + "/public"));

app.listen(port, () =>{
    console.log("Servidor Activo")
})