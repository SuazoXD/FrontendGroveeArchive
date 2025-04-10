import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerEndpoint } from "../../api";
import "./register.css";
import { GiCompactDisc } from "react-icons/gi";
import { FaUser, FaLock, FaEnvelope, FaInfoCircle, FaCheck } from "react-icons/fa";

export default function Register() {
  const [userData, setUserData] = useState({
    nombreUsuario: "",
    contrasenia: "",
    correo: "",
    idRol: 2,
  });
  const [error, setError] = useState("");
  const [popup, setPopup] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const navigate = useNavigate();

  // Lista de dominios confiables
  const trustedDomains = [
    "@gmail.com",
    "@outlook.com",
    "@hotmail.com",
    "@yahoo.com",
    "@protonmail.com",
    "@icloud.com",
    "@zoho.com",
    "@unah.hn",
    "@unah.hn.edu",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });

    if (name === "contrasenia") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*]/.test(value),
      });
    }
  };

  const isEmailTrusted = () => {
    return trustedDomains.some((domain) => userData.correo.endsWith(domain));
  };

  const validateFields = () => {
    if (!userData.nombreUsuario || userData.nombreUsuario.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres.");
      return false;
    }
    if (
      !userData.contrasenia ||
      !passwordValidation.length ||
      !passwordValidation.uppercase ||
      !passwordValidation.lowercase ||
      !passwordValidation.number ||
      !passwordValidation.special
    ) {
      setError("La contraseña no cumple con los requisitos.");
      return false;
    }
    if (!userData.correo || !/\S+@\S+\.\S+/.test(userData.correo)) {
      setError("Ingresa un correo válido.");
      return false;
    }
    if (!isEmailTrusted()) {
      setError("El dominio del correo no es confiable. Usa uno de la lista.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setPopup({ type: "error", message: error });
      return;
    }

    try {
      const response = await registerEndpoint(userData);
      setPopup({
        type: "success",
        message: response.mensaje || "¡Usuario registrado correctamente!",
        onClose: () => navigate("/profile"),
      });
    } catch (error) {
      setPopup({
        type: "error",
        message: "Error al registrarse. Verifica los datos.",
      });
    }
  };

  const showEmailDomains = () => {
    setPopup({
      type: "info",
      message: (
        <div>
          <p>Correos electrónicos confiables:</p>
          <ul>
            <li>Gmail (@gmail.com)</li>
            <li>Outlook/Hotmail (@outlook.com, @hotmail.com)</li>
            <li>Yahoo (@yahoo.com)</li>
            <li>ProtonMail (@protonmail.com)</li>
            <li>iCloud (@icloud.com)</li>
            <li>Zoho Mail (@zoho.com)</li>
            <li>UNAH (@unah.hn o @unah.hn.edu)</li>
          </ul>
        </div>
      ),
    });
  };

  const closePopup = () => {
    if (popup?.onClose) popup.onClose();
    setPopup(null);
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const isFormComplete = userData.nombreUsuario && userData.contrasenia && userData.correo;

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="logo-container">
          <GiCompactDisc size={60} color="#fff" />
        </div>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="nombreUsuario"
              placeholder="Nombre de usuario"
              value={userData.nombreUsuario}
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
              value={userData.contrasenia}
              onChange={handleChange}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="input-field"
            />
            {isPasswordValid && <FaCheck className="check-icon" />}
          </div>
          {isPasswordFocused && !isPasswordValid && (
            <div className="password-validation">
              <p>🔒 La contraseña debe contener:</p>
              <ul>
                <li className={passwordValidation.length ? "valid" : ""}>Al menos 8 caracteres</li>
                <li className={passwordValidation.uppercase ? "valid" : ""}>Una letra mayúscula</li>
                <li className={passwordValidation.lowercase ? "valid" : ""}>Una letra minúscula</li>
                <li className={passwordValidation.number ? "valid" : ""}>Un número</li>
                <li className={passwordValidation.special ? "valid" : ""}>Un carácter especial (!@#$%^&*)</li>
              </ul>
            </div>
          )}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={userData.correo}
              onChange={handleChange}
              className="input-field"
            />
            {isEmailTrusted() ? (
              <FaCheck className="check-icon" />
            ) : (
              <FaInfoCircle className="info-icon" onClick={showEmailDomains} />
            )}
          </div>
          <button
            type="submit"
            className="register-btn"
            disabled={!isFormComplete || !isPasswordValid || !isEmailTrusted()}
          >
            REGISTER
          </button>
        </form>
      </div>
      {popup && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
          <button onClick={closePopup}>Cerrar</button>
        </div>
      )}
    </div>
  );
}