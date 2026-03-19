import { useEffect, useState } from "react"
import API, { crearVale, obtenerGananciasPeriodo } from "../services/api"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [valeForm, setValeForm] = useState({ monto: "", descripcion: "" })
    const [gananciasPeriodo, setGananciasPeriodo] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
            // No llamar a fetchStats aquí, dejar que el otro useEffect lo haga cuando user cambie
        } else {
            navigate("/login")
        }
    }, [navigate])

    useEffect(() => {
        if (user && user.rol) {
            fetchStats()
        }
    }, [fecha, user])

    const fetchStats = async () => {
        setError(null)
        try {
            const endpoint = user.rol === "admin"
                ? `/cortes/cierre?fecha=${fecha}`
                : `/cortes/estadisticas/personal?fecha=${fecha}`

            const res = await API.get(endpoint)
            setStats(res.data)

            if (user.rol === "admin") {
                const resPeriodo = await obtenerGananciasPeriodo()
                setGananciasPeriodo(resPeriodo.data)
            }
        } catch (error) {

            console.error(error)
            setError("Error al cargar las estadísticas. Reintenta en unos momentos.")
        }
    }

    const handleValeSubmit = async (e) => {
        e.preventDefault()
        if (!valeForm.monto || !valeForm.descripcion) return
        try {
            await crearVale(Number(valeForm.monto), valeForm.descripcion)
            setValeForm({ monto: "", descripcion: "" })
            fetchStats() // recargar stats para ver el descuento
            alert("Vale registrado correctamente")
        } catch (error) {
            alert("Error al registrar vale")
        }
    }

    if (error) return (
        <div className="dashboard-container">
            <h2 className="error-message">{error}</h2>
            <button className="promo-button" onClick={fetchStats}>Reintentar</button>
        </div>
    )

    if (!stats || !user) return <h2 className="loading">Cargando...</h2>

    const isAdmin = user.rol === "admin"
    const resumen = isAdmin ? stats.resumen?.[0] : stats
    const hasData = isAdmin ? (resumen?.totalCortes > 0 || (stats.totalVales && stats.totalVales > 0)) : (stats.totalCortes > 0 || stats.misVales > 0)
    
    // Calcular efectivo neto (Efectivo - Vales) para el admin
    const pagosAdmin = stats.pagos || []
    const totalEfectivoBruto = pagosAdmin.find(p => p._id === "efectivo")?.total || 0
    const totalValesAdmin = stats.totalVales || 0
    const efectivoNeto = totalEfectivoBruto - totalValesAdmin

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">
                    {isAdmin ? "Panel Admin" : `¡Hola, ${user.nombre}!`}
                </h1>
                <div className="date-selector-container">
                    <label className="date-label">Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        className="date-input"
                    />
                </div>
            </div>

            {isAdmin ? (
                // VISTA ADMIN
                <>
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <h3 className="stat-label">Total del día</h3>
                            <p className="stat-value">${resumen?.totalDia || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">Cortes Total</h3>
                            <p className="stat-value">{resumen?.totalCortes || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">Ganancia Barberos</h3>
                            <p className="stat-value">${resumen?.totalBarberos || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">Ganancia Tienda</h3>
                            <p className="stat-value">${resumen?.totalTienda || 0}</p>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {gananciasPeriodo && (
                            <>
                                <div className="stat-card accent">
                                    <h3 className="stat-label">Ganancia Tienda (Semana Lunes-Dom)</h3>
                                    <p className="stat-value">${gananciasPeriodo.semana || 0}</p>
                                </div>
                                <div className="stat-card accent">
                                    <h3 className="stat-label">Ganancia Tienda (Mes)</h3>
                                    <p className="stat-value">${gananciasPeriodo.mes || 0}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="admin-extra-stats">
                        <div className="stat-card comparison-card">
                            <h3>Efectivo vs Transferencia</h3>
                            <div className="comparison-row">
                                <div className="comparison-item">
                                    <span className="comparison-label">efectivo (Caja Fuerte)</span>
                                    <span className="comparison-value">${efectivoNeto} <small className="descuento-nota">(-${totalValesAdmin} en Vales)</small></span>
                                </div>
                                <div className="comparison-item">
                                    <span className="comparison-label">transferencia</span>
                                    <span className="comparison-value">${pagosAdmin.find(p => p._id === "transferencia")?.total || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card barber-list-card">
                            <h3>Desglose por Barbero</h3>
                            <div className="barber-stats-list">
                                {stats.barberos?.length > 0 ? (
                                    stats.barberos.map(b => (
                                        <div key={b._id} className="barber-stat-item">
                                            <span className="barber-name">{b.nombre}</span>
                                            <div className="barber-metrics">
                                                <span>{b.totalCortes} cortes</span>
                                                <span className="barber-money">${b.ganancia}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No hay actividad hoy</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // VISTA BARBERO
                <>
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <h3 className="stat-label">Mis Cortes hoy</h3>
                            <p className="stat-value">{stats.totalCortes || 0}</p>
                        </div>
                        <div className="stat-card">
                            <h3 className="stat-label">Mi Ganancia Bruta</h3>
                            <p className="stat-value">${stats.misGanancias || 0}</p>
                        </div>
                        <div className="stat-card alert">
                            <h3 className="stat-label">Mis Vales</h3>
                            <p className="stat-value">-${stats.misVales || 0}</p>
                        </div>
                        <div className="stat-card accent">
                            <h3 className="stat-label">Mi Ganancia Neta</h3>
                            <p className="stat-value">${stats.misGananciasNeto || 0}</p>
                        </div>
                    </div>

                    <div className="admin-extra-stats">
                        <div className="stat-card">
                            <h3>Registrar Vale de Efectivo</h3>
                            <form onSubmit={handleValeSubmit} className="vale-form" style={{display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <input 
                                    type="number" 
                                    placeholder="Monto ($)" 
                                    value={valeForm.monto} 
                                    onChange={(e) => setValeForm({...valeForm, monto: e.target.value})}
                                    required
                                    className="admin-input"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Concepto (Ej. Comida)" 
                                    value={valeForm.descripcion} 
                                    onChange={(e) => setValeForm({...valeForm, descripcion: e.target.value})}
                                    required
                                    className="admin-input"
                                />
                                <button type="submit" className="promo-button">Registrar Vale</button>
                            </form>
                        </div>

                        {stats.vales && stats.vales.length > 0 && (
                            <div className="stat-card">
                                <h3>Voucher/Vales de Hoy</h3>
                                <div style={{marginTop: '10px'}}>
                                    {stats.vales.map(v => (
                                        <div key={v._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #444' }}>
                                            <span>{v.descripcion}</span>
                                            <span style={{color: '#ff6b6b'}}>-${v.monto}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {!hasData && !isAdmin && (
                <div className="motivation-card">
                    <h2>✨ ¡Buen día!</h2>
                    <p>Empieza con energía, pronto registrarás tu primer corte de hoy. 🚀</p>
                    <button className="promo-button" onClick={() => navigate("/cortes")}>
                        Registrar mi primer corte
                    </button>
                </div>
            )}

            <div className="stats-info">
                <p>💡 Estás viendo el resumen de la fecha seleccionada.</p>
            </div>
        </div>
    )
}

export default Dashboard