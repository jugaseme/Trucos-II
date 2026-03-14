import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
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
        } catch (error) {

            console.error(error)
            setError("Error al cargar las estadísticas. Reintenta en unos momentos.")
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
    const hasData = isAdmin ? (resumen?.totalCortes > 0) : (stats.totalCortes > 0)

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

                    <div className="admin-extra-stats">
                        <div className="stat-card comparison-card">
                            <h3>Efectivo vs Transferencia</h3>
                            <div className="comparison-row">
                                {["efectivo", "transferencia"].map(metodo => {
                                    const data = stats.pagos?.find(p => p._id === metodo)
                                    return (
                                        <div key={metodo} className="comparison-item">
                                            <span className="comparison-label">{metodo}</span>
                                            <span className="comparison-value">${data?.total || 0}</span>
                                        </div>
                                    )
                                })}
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
                <div className="dashboard-grid">
                    <div className="stat-card">
                        <h3 className="stat-label">Mis Cortes hoy</h3>
                        <p className="stat-value">{stats.totalCortes || 0}</p>
                    </div>
                    <div className="stat-card accent">
                        <h3 className="stat-label">Mi Ganancia</h3>
                        <p className="stat-value">${stats.misGanancias || 0}</p>
                    </div>
                </div>
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