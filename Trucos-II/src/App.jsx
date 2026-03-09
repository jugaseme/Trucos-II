import { useState } from 'react'
import './App.css'

function App() {
const [saldo, setSaldo] = useState(0)
const [valor, setValor] = useState(0)



  return (
    <>
    <div>
      <h1>Trucos II</h1>

      <h2>Saldo: ${saldo.toLocaleString("es-Co") }</h2>
      <input value={valor} onChange={(e) => setValor(Number(e.target.value))} />
      <button onClick={() => setSaldo(saldo + valor)}>Depositar</button>
      <button onClick={() => setSaldo(saldo - valor)}>Retirar</button>

    </div>
    </>
  )
}

export default App
