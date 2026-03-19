const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Vale = require("../models/Vale")
const { auth, admin } = require("../middleware/auth")

// Registra un nuevo vale (Cualquier usuario autenticado - Barbero/Admin)
router.post("/", auth, async (req, res) => {
    try {
        const { monto, descripcion } = req.body
        const barbero = req.user.id

        const nuevoVale = new Vale({
            monto,
            descripcion,
            barbero
        })

        const valeGuardado = await nuevoVale.save()
        res.json(valeGuardado)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener los vales personales (Para el barbero logueado) - por defecto de hoy, o de una fecha
router.get("/personal", auth, async (req, res) => {
    try {
        const { fecha } = req.query
        let filtroFecha = {}
        
        if (fecha) {
            const inicio = new Date(fecha)
            inicio.setHours(0, 0, 0, 0)
            const fin = new Date(fecha)
            fin.setHours(23, 59, 59, 999)
            filtroFecha = { fecha: { $gte: inicio, $lte: fin } }
        }

        const barberoId = new mongoose.Types.ObjectId(req.user.id)

        const vales = await Vale.find({
            barbero: barberoId,
            ...filtroFecha
        }).sort({ fecha: -1 })

        res.json(vales)
    } catch (error) {
        console.error("Error en /vales/personal:", error)
        res.status(500).json({ error: error.message })
    }
})

// Obtener todos los vales (Solo Admin)
router.get("/", auth, admin, async (req, res) => {
    try {
        const { inicio, fin } = req.query
        let filtroFiltros = {}
        
        if (inicio && fin) {
            filtroFiltros = {
                fecha: {
                    $gte: new Date(inicio),
                    $lte: new Date(fin)
                }
            }
        }

        const vales = await Vale.find(filtroFiltros).populate("barbero", "nombre").sort({ fecha: -1 })
        res.json(vales)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router
