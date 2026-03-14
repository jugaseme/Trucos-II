const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Corte = require("../models/Corte")
const { auth, admin } = require("../middleware/auth")

// REGISTRAR CORTE (Cualquier usuario autenticado - Barbero/Admin)
router.post("/", auth, async (req, res) => {
    try {
        const { precio, servicio, metodoPago } = req.body
        const barbero = req.user.id // Se toma del token automáticamente

        const gananciaBarbero = precio * 0.5
        const gananciaTienda = precio * 0.5

        const nuevoCorte = new Corte({
            precio,
            barbero,
            servicio,
            metodoPago,
            gananciaBarbero,
            gananciaTienda
        })

        const corteGuardado = await nuevoCorte.save()
        res.json(corteGuardado)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// VER TODOS LOS CORTES (Solo Admin)
router.get("/", auth, admin, async (req, res) => {
    try {
        const cortes = await Corte.find().populate("barbero", "nombre")
        res.json(cortes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// ESTADISTICAS (Solo Admin)
router.get("/estadisticas/barberos", auth, admin, async (req, res) => {
    const data = await Corte.aggregate([
        {
            $group: {
                _id: "$barbero",
                totalCortes: { $sum: 1 },
                totalGanado: { $sum: "$gananciaBarbero" }
            }
        }
    ])
    res.json(data)
})

router.get("/estadisticas/tienda", auth, admin, async (req, res) => {
    const data = await Corte.aggregate([
        {
            $group: {
                _id: null,
                totalTienda: { $sum: "$gananciaTienda" }
            }
        }
    ])
    res.json(data)
})

router.get("/estadisticas/pagos", auth, admin, async (req, res) => {
    const data = await Corte.aggregate([
        {
            $group: {
                _id: "$metodoPago",
                total: { $sum: "$precio" }
            }
        }
    ])
    res.json(data)
})

router.get("/estadisticas/dias", auth, admin, async (req, res) => {
    const data = await Corte.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$fecha" }
                },
                totalDia: { $sum: "$precio" }
            }
        }
    ])
    res.json(data)
})

router.get("/estadisticas/saldos", auth, admin, async (req, res) => {
    const data = await Corte.aggregate([
        {
            $group: {
                _id: "$barbero",
                saldo: { $sum: "$gananciaBarbero" }
            }
        }
    ])
    res.json(data)
})

// Filtro (Solo Admin)
router.get("/filtro", auth, admin, async (req, res) => {
    try {
        const { inicio, fin } = req.query
        const cortes = await Corte.find({
            fecha: {
                $gte: new Date(inicio),
                $lte: new Date(fin)
            }
        }).populate("barbero", "nombre")
        res.json(cortes)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Estadisticas Personales (Para el barbero logueado)
router.get("/estadisticas/personal", auth, async (req, res) => {
    try {
        const { fecha } = req.query
        const inicio = new Date(fecha)
        inicio.setHours(0, 0, 0, 0)
        const fin = new Date(fecha)
        fin.setHours(23, 59, 59, 999)

        // Convertir ID a ObjectId de forma segura
        const barberoId = new mongoose.Types.ObjectId(req.user.id)

        const stats = await Corte.aggregate([
            {
                $match: {
                    barbero: barberoId,
                    fecha: { $gte: inicio, $lte: fin }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCortes: { $sum: 1 },
                    misGanancias: { $sum: "$gananciaBarbero" }
                }
            }
        ])

        res.json(stats[0] || { totalCortes: 0, misGanancias: 0 })
    } catch (error) {
        console.error("Error en /estadisticas/personal:", error)
        res.status(500).json({ error: error.message })
    }
})

// Estadistica Mensual (Solo Admin)
router.get("/estadisticas/mensual", auth, admin, async (req, res) => {
    try {
        const data = await Corte.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$fecha" },
                        month: { $month: "$fecha" }
                    },
                    totalMes: { $sum: "$precio" },
                    totalBarberos: { $sum: "$gananciaBarbero" },
                    totalTienda: { $sum: "$gananciaTienda" },
                    totalCortes: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            }
        ])
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Cierre de caja (Solo Admin)
router.get("/cierre", auth, admin, async (req, res) => {
    try {
        const { fecha } = req.query
        const inicio = new Date(fecha)
        inicio.setHours(0, 0, 0, 0)
        const fin = new Date(fecha)
        fin.setHours(23, 59, 59, 999)

        const cierre = await Corte.aggregate([
            {
                $match: {
                    fecha: {
                        $gte: inicio,
                        $lte: fin
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalDia: { $sum: "$precio" },
                    totalBarberos: { $sum: "$gananciaBarbero" },
                    totalTienda: { $sum: "$gananciaTienda" },
                    totalCortes: { $sum: 1 }
                }
            }
        ])

        const pagos = await Corte.aggregate([
            {
                $match: {
                    fecha: {
                        $gte: inicio,
                        $lte: fin
                    }
                }
            },
            {
                $group: {
                    _id: "$metodoPago",
                    total: { $sum: "$precio" }
                }
            }
        ])

        const barberosResumen = await Corte.aggregate([
            {
                $match: {
                    fecha: {
                        $gte: inicio,
                        $lte: fin
                    }
                }
            },
            {
                $group: {
                    _id: "$barbero",
                    totalCortes: { $sum: 1 },
                    ganancia: { $sum: "$gananciaBarbero" }
                }
            },
            {
                $lookup: {
                    from: "usuarios",
                    localField: "_id",
                    foreignField: "_id",
                    as: "info"
                }
            },
            { $unwind: "$info" },
            {
                $project: {
                    nombre: "$info.nombre",
                    totalCortes: 1,
                    ganancia: 1
                }
            }
        ])

        res.json({
            resumen: cierre,
            pagos: pagos,
            barberos: barberosResumen
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router

module.exports = router