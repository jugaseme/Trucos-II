require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")

const usuariosRoutes = require("./routes/usuarios")
const authRoutes = require("./routes/auth")
const cortesRoutes = require("./routes/cortes")
const valesRoutes = require("./routes/vales")

const app = express()

connectDB()

// Configuración CORS estricta y segura
const corsOptions = {
    origin: ["http://localhost:5173", "https://trucos-ii.vercel.app"], // Permite local y producción
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204
}
app.use(cors(corsOptions))
app.use(express.json())

// Middleware para ver qué peticiones llegan
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} - Petición: ${req.method} ${req.url}`)
    next()
})

// Ruta de prueba para confirmar que el servidor funciona
app.get("/", (req, res) => {
    res.json({ mensaje: "Servidor de Trucos II funcionando correctamente", status: "online" })
})

app.use("/usuarios", usuariosRoutes)
app.use("/auth", authRoutes)
app.use("/cortes", cortesRoutes)
app.use("/vales", valesRoutes)

const PORT = 3001

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT)
})