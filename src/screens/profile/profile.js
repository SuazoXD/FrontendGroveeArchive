import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, getRole, updateProfile, deleteProfile } from "../../api";
import "./profile.css";
import { FaReact, FaEdit, FaTrash } from "react-icons/fa"; // Íconos para editar y eliminar

export default function Profile() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPopup, setEditPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        const roleData = await getRole(profileData.idRol);
        setUser(profileData);
        setRole(roleData);
        setFormData({
          nombreUsuario: profileData.nombreUsuario,
          contrasenia: "",
          correo: profileData.correo,
          idRol: profileData.idRol,
        });
        setLoading(false);
      } catch (error) {
        navigate("/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user.id, formData);
      setUser({ ...user, ...formData, contrasenia: undefined }); // Actualiza localmente, oculta contraseña
      setEditPopup(false);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al actualizar el perfil" });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar tu cuenta?")) {
      try {
        await deleteProfile(user.id);
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        setMessage({ type: "error", text: "Error al eliminar la cuenta" });
      }
    }
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="screen-container">
      <div className="profile-card">
        <div className="profile-header">
          <FaReact size={100} color="#DB5E25" className="profile-icon" />
        </div>
        <div className="profile-info">
          <h2>{user.nombreUsuario}</h2>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Rol:</strong> {role.nombreRol} ({role.descripcion})</p>
          <p><strong>Fecha de Registro:</strong> {new Date(user.fechaRegistro).toLocaleDateString()}</p>
        </div>
        <div className="profile-actions">
          <button className="action-btn" onClick={() => setEditPopup(true)}>
            <FaEdit size={30} />
          </button>
          <button className="action-btn" onClick={handleDelete}>
            <FaTrash size={30} />
          </button>
        </div>
      </div>

      {editPopup && (
        <div className="edit-popup">
          <form onSubmit={handleEditSubmit} className="edit-form">
            <h3>Editar Perfil</h3>
            <input
              type="text"
              name="nombreUsuario"
              placeholder="Nombre de usuario"
              value={formData.nombreUsuario}
              onChange={handleEditChange}
              className="input-field"
            />
            <input
              type="password"
              name="contrasenia"
              placeholder="Nueva contraseña (opcional)"
              value={formData.contrasenia}
              onChange={handleEditChange}
              className="input-field"
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={formData.correo}
              onChange={handleEditChange}
              className="input-field"
            />
            <div className="edit-buttons">
              <button type="submit" className="save-btn">Guardar</button>
              <button type="button" className="cancel-btn" onClick={() => setEditPopup(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {message && (
        <div className={`message-popup ${message.type}`}>
          <p>{message.text}</p>
          <button onClick={() => setMessage(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}