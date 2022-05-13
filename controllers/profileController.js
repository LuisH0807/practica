const formidable = require("formidable");
const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const User = require("../models/User");

const profileForm = async(req, res) =>{
    try {
        const user = await User.findById(req.user.id);
        return res.render("profile", {user: req.user, image: user.image})
    } catch (error) {
        req.flash("mensajes", [{msg: "No se puede leer perfil"}]);
        return res.redirect("/perfil");
    }
};

const changeProfilePic = (req, res) =>{
    const form = new formidable.IncomingForm();

    form.maxFileSize = 50 * 1024 * 1024; //50MB

    form.parse(req, async (err, fields, files)=>{
        

        if(err){
            req.flash("mensajes", [{msg: "Fallo al subir la Imagen"}]);
            return res.redirect("/perfil");
        }

        const file = files.myFile;

        //VALIDACIONES PARA LAS IMAGENES

        try {
            if(file.originalFilename === ""){
                throw new Error("Porfavor agrega una imagen");
            }
            //console.log(fields);
            //console.log(files);    
            
            //FORMATOS DE IMAGEN QUE PERMITIREMOS 
            const imageTypes =[
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
            ];

            if(!imageTypes.includes(file.mimetype)){
                throw new Error("Por favor agrega una imagen con formato .jpg o png");
            }

            if(file.size > 50 * 1024 * 1024){
                throw new Error("Maximo 50MB Alcanzado ");
            }

            //EXTENSION QUE VA A TOMAR
            const extension = file.mimetype.split("/")[1];//Tomaria la segunda extension image/jpeg, tomaria entonces el jpeg
            //RUTA EN LA QUE VA A GUARDAR LA IMAGEN
            const dirFile = path.join(
                __dirname,
                `../public/img/uploads/${req.user.id}.${extension}`
            );

            fs.renameSync(file.filepath, dirFile);

          //REDUCIENDO EL TAMAÑO DE LA IMAGEN  
            const image = await Jimp.read(dirFile);
            image
                .resize(200, 200)
                .quality(90)
                .writeAsync(dirFile);

        //HACIENDO REF AL USUARIO        
            const user = await User.findById(req.user.id);
            user.image = `${req.user.id}.${extension}`;//CAMBIANDO LA IMAGEN
            //GUARDANDO
            await user.save();

            req.flash("mensajes", [{msg: "Se guardo la imagen"}]);
            return res.redirect("/perfil");

        } catch (error) {
            console.log(error);
            req.flash("mensaje", [{msg: error.message}]);
            return res.redirect("/perfil");
        }
    });
};


module.exports = {
    profileForm,
    changeProfilePic,
}