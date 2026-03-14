import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
    const navigate = useNavigate()

    let user = null
    try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            user = JSON.parse(storedUser)
        }
    } catch (error) {
        console.error("Error parsing user from localStorage", error)
    }

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        navigate("/login")
    }

    if (!user) return null

    return (
        <nav className="navbar">
            <div className="navbar-logo">Trucos II</div>
            <div className="navbar-links">
                {user.rol === "admin" && (
                    <Link to="/" className="navbar-link">Dashboard</Link>
                )}
                <Link to="/cortes" className="navbar-link">Registrar Corte</Link>
                {user.rol === "admin" && (
                    <Link to="/admin" className="navbar-link">Usuarios</Link>
                )}
                <button onClick={handleLogout} className="navbar-logout">
                    Salir
                </button>
            </div>
        </nav>
    )
}

export default Navbar