require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const usuariosRoutes = require("./routes/usuarios.js")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/usuarios", usuariosRoutes)

app.get("/test", (req, res) => {
    res.send("Ruta funcionando")
})

const PORT = 3001

app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT)
})