import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import RegistrarCorte from "./pages/Cortes"
import Admin from "./pages/Admin"

import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute rolRequerido="admin,barbero">
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/cortes"
          element={
            <PrivateRoute rolRequerido="barbero,admin">
              <RegistrarCorte />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute rolRequerido="admin">
              <Admin />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App