const express = require("express")
const router = express.Router()

const Usuario = require("../models/Usuario")

router.post("/", async (req, res) => {

    try {

        const nuevoUsuario = new Usuario(req.body)

        const usuarioGuardado = await nuevoUsuario.save()

        res.json(usuarioGuardado)

    } catch (error) {

        res.status(500).json({ error: error.message })

    }

})

module.exports = router