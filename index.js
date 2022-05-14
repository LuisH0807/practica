const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const MongoStore = require("connect-mongo");
const clientDB = require("./database/db");
const { create } = require("express-handlebars");
const passport = require("passport");
const bodyParser = require("body-parser");
const User = require("./models/User");
const mongoSanitize = require("express-mongo-sanitize");
const csrf = require("csurf");
const cors = require("cors");
require("dotenv").config();
//require("./database/db");


//MIDDLEWARE
const corsOption ={
    credentials: true,
    origin: process.env.PATHURL || "*", //"https://uur.herokuapp.com/"  --> Otro metodo, y en .env se debria poner el http://localhost:5000
    methods: ["GET", "POST"],
};
app.use(cors(corsOption));

app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: false,
        name: "session-user",
        store: MongoStore.create({
            clientPromise: clientDB,
            dbName: process.env.dbName,
        }),
        cookie:{
            secure:process.env.mode === "production", // si es true usara el https, si no usara http por ende el localhost
            maxAge: 30 * 24 * 60 * 60 * 1000
        },
        //cookie: {secure: true, maxAge: 30 * 24 * 60 * 60 * 1000}, Indica cuanto durara una session, esto solo se vera cuando la web este en produccion
    })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

//app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));


app.use(csrf());
app.use(mongoSanitize());//Debe leerse antes de las rutas

app.use((req, res, next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash("mensajes");
    next();
})

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/home"));


app.use(express.static(__dirname + "/public"));


// CONFIGURACION SESSIONS(PASSPORT)

passport.serializeUser((user, done)=>{
   done(null, {id: user._id, userName: user.userName});
});

passport.deserializeUser(async(user, done)=>{
    const userDB = await User.findById(user.id).exec()
    return done(null, {id: userDB._id, userName: userDB.userName});
})


//CONFIGURACION DE HBS
const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");



//CONEXION CON .ENV Y PUERTO
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log("Servidor Activo: " + PORT)
})