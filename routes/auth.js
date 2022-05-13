const express = require("express");
const {body} = require("express-validator");
const { registerForm, 
        registerUser, 
        confirmAccount, 
        loginForm,
        loginUser,
        closeSession} = require("../controllers/authController");
const router = express.Router();

router.get("/register", registerForm);

router.post("/register",[
        body("userName", "Ingrese su Nombre de Usuario")
                .trim()
                .notEmpty()
                .escape(),
        body("email", "Ingrese su Correo Electronico")
                .trim()
                .isEmail()
                .normalizeEmail(),
        body("password", "Ingrese su Contraseña")
                .trim()
                .isLength({min: 6})
                .escape()
                .custom((value, {req})=>{
                        if (value !== req.body.rePassword){
                                throw new Error("Las Contraseñas no coinciden");
                        } else{
                                return value
                        }
                }),      
              

        ], registerUser);
router.get("/confirm/:token", confirmAccount)
router.get("/login", loginForm);

router.post("/login",[
        body("email", "Ingrese un Correo Valido")
                .trim()
                .isEmail()
                .normalizeEmail(),
        body("password", "Ingrese una contraseña valida")
                .trim()
                .isLength({min: 6})
                .escape(),
], loginUser);

router.get("/logout",closeSession)
 module.exports=router;   