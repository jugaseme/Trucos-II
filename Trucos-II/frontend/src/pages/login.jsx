import { useState } from "react"
import API from "../services/api"
import AdComponent from "../components/AdComponent"
import "./Login.css"

function Login() {
    const [nombre, setNombre] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await API.post("/auth/login", { nombre, password })
            localStorage.setItem("user", JSON.stringify(res.data.user))
            localStorage.setItem("token", res.data.token)
            window.location.href = "/"
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al iniciar sesión")
        }
    }

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-card">
                <div className="login-header">
                    <h2 className="login-title">Trucos II</h2>
                    <p className="login-subtitle">Inicia sesión para continuar</p>
                </div>

                <div className="input-group">
                    <label className="input-label">Usuario</label>
                    <input
                        placeholder="Ingresa tu usuario"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="login-input"
                    />
                </div>

                <div className="input-group">
                    <label className="input-label">Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                </div>

                <button type="submit" className="login-button">
                    Entrar al Panel
                </button>
            </form>

            <AdComponent adSlot="TU_ID_DE_BLOQUE" />
        </div>
    )
}

export default Login