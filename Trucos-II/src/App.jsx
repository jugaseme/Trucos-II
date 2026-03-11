import { useState } from 'react'
import './App.css'

function App() {
  const Corte = [
    { Valor: 0, Pago: "" }
  ]
  const barberos = [
    { id: 1, nombre: "santiago", password: "12345" },
    { id: 2, nombre: "leo", password: "12345" },
    { id: 3, nombre: "ivan", password: "12345" }
  ]
  const [barberoActivo, setBarberoActivo] = useState(null)
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [cortes, setCortes] = useState([])
  const [metodoPago, setMetodoPago] = useState("efectivo")

  function login() {
    const usuario = barberos.find(
      (b) => b.nombre === nombre && b.password === password
    )

    if (usuario) {
      setBarberoActivo(usuario)
    } else {
      alert("Datos incorrectos")
    }
  }

  function registrarCorte() {
    const nuevoCorte = {
      barbero: barberoActivo.nombre,
      valor: valor,
      metodo: metodoPago,
      fecha: new Date().toLocaleDateString()
    }

    setCortes([...cortes, nuevoCorte])
  }


  return (
    <>
      <div className="App">
        <h1>Trucos II</h1>

        {!barberoActivo && (
          <div>
            <h2>Iniciar sesión</h2>

            <input
              placeholder="Nombre"
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={login}>Entrar</button>


          </div>

        )}
        <select onChange={(e) => setMetodoPago(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>

      </div>
    </>
  )
}

export default App
