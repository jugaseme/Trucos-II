
import { Navigate } from "react-router-dom"

function PrivateRoute({ children, rolRequerido }) {
    let user = null
    try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            user = JSON.parse(storedUser)
        }
    } catch (error) {
        console.error("Error parsing user from localStorage", error)
        // Opcional: limpiar localStorage si el dato está corrupto
        // localStorage.removeItem("user")
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    if (rolRequerido) {
        const roles = rolRequerido.split(",")
        if (!roles.includes(user.rol) && user.rol !== "admin") {
            // Si no tiene permiso, redirigir a una página que SÍ pueda ver
            // o simplemente al login si es un caso extremo.
            return <Navigate to="/login" />
        }
    }

    return children
}

export default PrivateRoute