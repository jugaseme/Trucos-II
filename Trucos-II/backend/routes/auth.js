const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Usuario = require("../models/Usuario")

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { nombre, password } = req.body
        const usuario = await Usuario.findOne({ nombre })

        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" })
        }

        const isMatch = await bcrypt.compare(password, usuario.password)
        if (!isMatch) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" })
        }

        const payload = {
            user: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
            (err, token) => {
                if (err) throw err
                res.json({
                    mensaje: "Login correcto",
                    token,
                    user: payload.user
                })
            }
        )

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router