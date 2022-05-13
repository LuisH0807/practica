const express = require("express");
const router = express.Router();
const validarURL = require ("../middlewares/validarURL");
const {homeUrl, agregarUrl, eliminarUrl, editarUrlForm ,editarUrl, redirect} = require("../controllers/urlController");
const verifyUser = require("../middlewares/verifyUser");
const { profileForm, changeProfilePic } = require("../controllers/profileController");

router.get("/", verifyUser ,homeUrl);

router.post("/", verifyUser, validarURL,agregarUrl);

router.get("/eliminar/:id", verifyUser, eliminarUrl);

router.get("/editar/:id",verifyUser, editarUrlForm );

router.post("/editar/:id", verifyUser, validarURL, editarUrl);

router.get("/perfil", verifyUser, profileForm);

router.post("/perfil", verifyUser, changeProfilePic);

router.get("/:shortURL", redirect);




 module.exports=router;   