import { useState } from "react"
import API from "../services/api"
import AdComponent from "../components/AdComponent"
import "./Cortes.css"

function Cortes() {
    const [form, setForm] = useState({
        servicio: "",
        precio: "",
        metodoPago: "efectivo"
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await API.post("/cortes", form)
            alert("Corte registrado exitosamente")
            setForm({
                servicio: "",
                precio: "",
                metodoPago: "efectivo"
            })
        } catch (error) {
            alert("Error al registrar corte")
            console.log(error)
        }
    }

    return (
        <div className="cortes-container">
            <h1 className="cortes-title">Registrar Nuevo Corte</h1>
            <form onSubmit={handleSubmit}>
                <div className="cortes-form-group">
                    <label className="cortes-label">Servicio</label>
                    <input
                        name="servicio"
                        placeholder="Ej. Corte de Cabello + Barba"
                        value={form.servicio}
                        onChange={handleChange}
                        required
                        className="cortes-input"
                    />
                </div>

                <div className="cortes-form-group">
                    <label className="cortes-label">Precio</label>
                    <input
                        type="number"
                        name="precio"
                        placeholder="0.00"
                        value={form.precio}
                        onChange={handleChange}
                        required
                        className="cortes-input"
                    />
                </div>

                <div className="cortes-form-group">
                    <label className="cortes-label">Método de pago</label>
                    <select
                        name="metodoPago"
                        value={form.metodoPago}
                        onChange={handleChange}
                        className="cortes-select"
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <button type="submit" className="cortes-button">
                    Guardar Corte
                </button>
            </form>

            <AdComponent adSlot="TU_ID_DE_BLOQUE" />
        </div>
    )
}

export default Cortes