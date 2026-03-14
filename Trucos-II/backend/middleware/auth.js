const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.header("x-auth-token")

    if (!token) {
        return res.status(401).json({ mensaje: "No hay token, permiso denegado" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(401).json({ mensaje: "Token no válido" })
    }
}

const admin = (req, res, next) => {
    if (req.user.rol !== "admin") {
        return res.status(403).json({ mensaje: "Acceso denegado: se requiere rol de administrador" })
    }
    next()
}

module.exports = { auth, admin }
