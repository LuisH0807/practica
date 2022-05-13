const User = require("../models/User");
const {validationResult} = require("express-validator");
const {nanoid} = require("nanoid");
const nodemailer= require("nodemailer");
require("dotenv").config;


const registerForm = (req, res) =>{
    res.render("register");
}

const registerUser = async (req, res) =>{
    //console.log(req.body);
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/register");
    }
    
    const {userName, email, password, rePassword} = req.body;

 try {
     
    let user = await User.findOne({email});
    if(user) throw new Error("Este email ya se encuentra ocupado");
    
    user = new User({userName, email, password})
    user.tokenConfirm = nanoid();
    await user.save();
    //console.log(user);

    // Enviar Correo de confirmacion (Usando mailtrap para probar)
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.user,
          pass: process.env.pass
        }
      });

    // Esta info esta en la pagina de nodemailer
     await transport.sendMail({
        from: '"El PEPE 👻" <foo@example.com>',
        to: user.email,
        subject: "verifique cuenta de correo",
        html: `<a href="${process.env.PATHURL || 'http://localhost:5000'}/auth/confirm/${user.tokenConfirm}">verificar cuenta aquí</a>`, // NO es necesario llamar al PATHURL, pero, se hace como prueba
    });
    
    //res.json(user);
    req.flash("mensajes", [{msg: "Correo de Confirmaciòn Enviado"}]);
    res.redirect("/login");
 } catch (error) {
    req.flash("mensajes", [{msg: error.message}]); 
    res.redirect("/auth/register");
 }
};

const confirmAccount = async (req, res) =>{
    const {token} = req.params;
    try {
        const user = await User.findOne({tokenConfirm: token});
        if(!user) throw new Error("No se pudo Confirmar la cuenta");

        user.confirm = true;
        user.tokenConfirm = null;
        

        await user.save();
        req.flash("mensajes", [{msg: "Cuenta Confirmada con Exito"}]);
        return res.redirect("/auth/login")
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
}

const loginForm = (req, res) =>{
    res.render("login");
}

const loginUser = async (req, res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array());
        return res.redirect("/auth/login");
    }

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) throw new Error("No existe el Usuario");

        if(!user.confirm) throw new Error("La cuenta no esta Confirmada");

        if(!(await user.comparePassword(password))){
            throw new Error("Contraseña Incorrecta")
        }
        
          req.login(user, function(err){
              if(err) {
                  throw new Error("Error al crear la Sesiòn");
              }
              return res.redirect("/");
          });
       //res.render("home"); 
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        res.redirect("/auth/login");
    }
}

const closeSession = (req, res) =>{
    req.logout();
    return res.redirect("/auth/login");
}
module.exports = {
   registerForm,
   registerUser,
   confirmAccount,
   loginForm,
   loginUser,
   closeSession,
}