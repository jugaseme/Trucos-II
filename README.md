# 🏋️ Trucos-II - Sistema de Gestión de Barbería

Aplicación web full-stack para gestionar operaciones de barbería, incluyendo registro de cortes, estadísticas en tiempo real y panel administrativo.

**🔗 [Demo en vivo](https://trucos-ii.vercel.app)**

## ✨ Características

- ✅ **Autenticación segura** con JWT y contraseñas hasheadas (bcryptjs)
- ✅ **Sistema de roles** (admin y barbero) con rutas protegidas
- ✅ **Dashboard interactivo** con gráficos de estadísticas (Chart.js)
- ✅ **Registro de cortes** con validación en tiempo real
- ✅ **Panel administrativo** exclusivo para gestión y reportes
- ✅ **Sistema de vales** para clientes
- ✅ **API RESTful** bien estructurada
- ✅ **Responsive design** adaptado a dispositivos móviles

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Interfaz de usuario
- **Vite** - Bundler y servidor de desarrollo
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Chart.js** - Visualización de datos
- **CSS3** - Estilos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Hashing de contraseñas
- **CORS** - Control de acceso

## 📦 Instalación

### Requisitos previos
- Node.js (v16+)
- MongoDB (local o Atlas)
- npm o yarn

### Backend
```bash
cd Trucos-II/backend
npm install

# Crear archivo .env
echo "MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/trucos-ii" > .env

# Crear usuario admin inicial
node seed.js

# Iniciar servidor
npm start
# Servidor en http://localhost:3001
