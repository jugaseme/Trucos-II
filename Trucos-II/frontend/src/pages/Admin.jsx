import { useState, useEffect } from "react"
import API from "../services/api"
import AdComponent from "../components/AdComponent"
import "./Admin.css"

function Admin() {
    const [usuarios, setUsuarios] = useState([])
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        rol: "barbero"
    })

    useEffect(() => {
        fetchUsuarios()
    }, [])

    const fetchUsuarios = async () => {
        try {
            const res = await API.get("/usuarios")
            setUsuarios(res.data)
        } catch (error) {
            console.error("Error al cargar usuarios", error)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await API.post("/usuarios", form)
            alert("Usuario creado exitosamente")
            setForm({ nombre: "", email: "", password: "", rol: "barbero" })
            fetchUsuarios()
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al crear usuario")
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return
        try {
            await API.delete(`/usuarios/${id}`)
            fetchUsuarios()
        } catch (error) {
            alert("Error al eliminar usuario")
        }
    }

    return (
        <div className="admin-container">
            <h1 className="admin-title">Panel de Administración</h1>

            <div className="admin-grid-layout">
                <div className="admin-card">
                    <h2>Crear Nuevo Barbero</h2>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="admin-input" />
                        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="admin-input" />
                        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required className="admin-input" />
                        <select name="rol" value={form.rol} onChange={handleChange} className="admin-select">
                            <option value="barbero">Barbero</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <button type="submit" className="admin-button">
                            Crear Usuario
                        </button>
                    </form>
                </div>

                <div className="admin-card">
                    <h2>Usuarios Existentes</h2>
                    <div className="user-list">
                        {usuarios.map(u => (
                            <div key={u._id} className="user-item">
                                <div className="user-info">
                                    <span className="user-name">{u.nombre}</span>
                                    <span className="user-role">{u.rol}</span>
                                </div>
                                <button 
                                    onClick={() => handleDelete(u._id)}
                                    className="user-delete-btn"
                                    title="Eliminar usuario"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AdComponent adSlot="TU_ID_DE_BLOQUE" />
        </div>
    )
}

export default Admin
