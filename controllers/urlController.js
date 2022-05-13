const Url = require("../models/Url");
const {nanoid} = require("nanoid");


//READ
const homeUrl = async (req, res) =>{
    console.log(req.user);
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render("home", {urls: urls})
    }catch(error){
      req.flash("mensajes", [{msg: error.message}])
      return res.redirect("/")
    }
}



//CREATE      
const agregarUrl = async (req, res) => {
    const { origin } = req.body;
    
    try{
       const url = new Url({
                        origin: origin, 
                        shortURL: nanoid(8),
                        user: req.user.id
                    });
       await url.save();
       req.flash("mensajes", [{msg:"Se agrego la URL correctamente"}]);
       return res.redirect("/");
    } catch(error){
        //console.log(error)
        req.flash("mensajes", [{msg:error.message}]);
        return res.redirect("/")
    };
}

//DELETE
const eliminarUrl = async(req, res) =>{
    const {id} = req.params;

    try{
        //await Url.findByIdAndDelete(id);
        const url = await Url.findById(id);
        if(!url.user.equals(req.user.id)){
            throw new Error("Usted no puede Eliminar esta URL");
        };
        await url.remove();

        req.flash("mensajes", [{msg:"Se Elimino la URL correctamente"}]);
        return res.redirect("/")

    }catch(error){
        //console.log(error);
        req.flash("mensajes", [{msg:error.message}]);
        return res.redirect("/");
    }
}

//UPDATE

const editarUrlForm = async(req, res) =>{
    const {id} = req.params;
    try {
        const urlDB = await Url.findById(id).lean();
        //console.log(urlDB);
        if(!urlDB.user.equals(req.user.id)){
            throw new Error("Usted no puede editar esta URL");
        }
         return res.render("home", {urlDB});
    } catch (error) {
        req.flash("mensajes", [{msg:error.message}]);
        return res.redirect("/")
    }
}

const editarUrl = async (req, res) =>{
    const {id} = req.params;
    const {origin} = req.body
        try{
            const urlDB = await Url.findById(id);
            if(!urlDB.user.equals(req.user.id)){
                throw new Error("Usted no puede editar URl")
            }
            
            await urlDB.updateOne({origin});
            req.flash("mensajes", [{msg:"Url Editada correctamente"}]);
            res.redirect("/");
            
        } catch(error) {
            //console.log(error);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/");
        };
};

const redirect = async (req, res)=> {
    const {shortURL} = req.params;
    try {
        const url = await Url.findOne({shortURL:shortURL});
        if(!url) throw new Error("404 no se encuentra la url"); 
        return res.redirect(url.origin);
    } catch (error) {
        req.flash("mensajes", [{ msg: error.message }]);
        return res.redirect("/");
    }
}

module.exports = {
    homeUrl,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redirect,
};