import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginEndpoint } from "../../api";
import "./login.css";
import { GiCompactDisc } from "react-icons/gi";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; // Íconos para los campos

export default function Login() {
  const [credentials, setCredentials] = useState({
    nombreUsuario: "",
    contrasenia: "",
    correo: "",
    idRol: 2,
  });
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    if (!credentials.nombreUsuario || credentials.nombreUsuario.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return false;
    }
    if (!credentials.contrasenia || credentials.contrasenia.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres.");
      return false;
    }
    if (!credentials.correo || !/\S+@\S+\.\S+/.test(credentials.correo)) {
      setError("Ingresa un correo válido.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setPopup({ type: "error", message: error });
      return;
    }

    try {
      const response = await loginEndpoint(credentials);
      localStorage.setItem("token", response.token);
      setPopup({
        type: "success",
        message: "¡Inicio de sesión exitoso!",
        onClose: () => navigate("/profile"),
      });
    } catch (error) {
      setPopup({
        type: "error",
        message: "Error al iniciar sesión. Verifica tus credenciales.",
      });
    }
  };

  const closePopup = () => {
    if (popup?.onClose) popup.onClose();
    setPopup(null);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="logo-container">
          <GiCompactDisc size={60} color="#fff" />
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="nombreUsuario"
              placeholder="Nombre de usuario"
              value={credentials.nombreUsuario}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
              value={credentials.contrasenia}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={credentials.correo}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="login-btn">
            LOG IN
          </button>
        </form>
      </div>
      {popup && (
        <div className={`popup ${popup.type}`}>
          <p>{popup.message}</p>
          <button onClick={closePopup}>Cerrar</button>
        </div>
      )}
    </div>
  );
}