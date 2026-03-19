const mongoose = require("mongoose")

const ValeSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    barbero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Vale", ValeSchema)
