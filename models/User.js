const mongoose = require("mongoose");
const {Schema}= mongoose;
const bcrypt = require("bcryptjs");


const userSchema = new Schema({

    userName:{
        type: String,
        lowercase: true,
        required: true,
        match: [/^[a-zA-Z0-9]+$/, "Solo letras y numeros"],        
    },
    email:{
        type: String,
        lowercase: true,
        required: true,
        index:{unique:true},
    },
    image:{
        type:String,
        default: null,
    },
    password:{
        type: String,
        required: true,
    },
    tokenConfirm:{
        type: String,
        default: null,
    },
    confirm: {
        type:Boolean,
        default: false,
    },
});

userSchema.pre('save', async function(next){
    const user = this;
    if(!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Error al codificar la contraseña");
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

 module.exports = mongoose.model("User", userSchema);

    
