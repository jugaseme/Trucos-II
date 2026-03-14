const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI no está definida en el archivo .env");
        }
        
        console.log("Intentando conectar a MongoDB...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar el servidor
        })

        console.log("MongoDB conectado exitosamente")
    } catch (error) {
        console.error("Error conectando DB:", error.message)
        // No salimos del proceso aquí para permitir que el servidor intente re-intentar si es necesario, 
        // o para que podamos ver el error sin que el proceso muera instantáneamente en algunos casos.
        process.exit(1)
    }
}

module.exports = connectDB