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

export default API