const mongoose = require("mongoose")

const CorteSchema = new mongoose.Schema({

    precio: {
        type: Number,
        required: true
    },

    barbero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },

    servicio: String,

    metodoPago: {
        type: String,
        enum: ["efectivo", "transferencia"],
        default: "efectivo"
    },

    gananciaBarbero: Number,

    gananciaTienda: Number,

    fecha: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Corte", CorteSchema)