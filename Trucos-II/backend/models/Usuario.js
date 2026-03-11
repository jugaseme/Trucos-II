const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        default: "barbero"
    }
})

module.exports = mongoose.model("Usuario", UsuarioSchema)