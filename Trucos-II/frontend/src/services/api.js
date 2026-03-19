import axios from "axios"

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001"
})

// Interceptor para incluir el token en las peticiones
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers["x-auth-token"] = token
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

export const crearVale = (monto, descripcion) => API.post("/vales", { monto, descripcion })
export const obtenerValesAdmin = (inicio, fin) => API.get(`/vales?inicio=${inicio}&fin=${fin}`)

export const obtenerGananciasPeriodo = () => API.get("/cortes/estadisticas/ganancias-periodo")

export default API