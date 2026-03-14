const express = require("express")
const router = express.Router()
const Usuario = require("../models/Usuario.js")
const { auth, admin } = require("../middleware/auth")

// Obtener todos los usuarios (Solo Admin)
router.get("/", auth, admin, async (req, res) => {
    try {
        const usuarios = await Usuario.find().select("-password")
        res.json(usuarios)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Crear usuario (Solo Admin)
router.post("/", auth, admin, async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body
        
        let usuario = await Usuario.findOne({ email })
        if (usuario) return res.status(400).json({ mensaje: "El usuario ya existe" })

        usuario = new Usuario({ nombre, email, password, rol })
        await usuario.save()

        res.json({ mensaje: "Usuario creado exitosamente", usuario: { id: usuario.id, nombre, email, rol } })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Eliminar usuario (Solo Admin)
router.delete("/:id", auth, admin, async (req, res) => {
    try {
        await Usuario.findByIdAndDelete(req.params.id)
        res.json({ mensaje: "Usuario eliminado exitosamente" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router