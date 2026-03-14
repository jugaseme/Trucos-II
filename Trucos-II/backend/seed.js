require("dotenv").config()
const mongoose = require("mongoose")
const Usuario = require("./models/Usuario")
const connectDB = require("./config/db")

const seedAdmin = async () => {
    try {
        await connectDB()
        
        const adminExist = await Usuario.findOne({ nombre: "admin" })
        if (adminExist) {
            console.log("Admin ya existe, eliminando para resetear...")
            await Usuario.deleteOne({ nombre: "admin" })
        }

        const admin = new Usuario({
            nombre: "admin",
            email: "admin@trucos.com",
            password: "admin123", // Será hasheada por el middleware pre-save
            rol: "admin"
        })

        await admin.save()
        console.log("Admin creado exitosamente: usuario 'admin', password 'admin123'")
        process.exit()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

seedAdmin()
