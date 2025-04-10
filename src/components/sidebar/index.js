import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { MdFavoriteBorder } from "react-icons/md";
import { FaPlay, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
import { VscFileSubmodule } from "react-icons/vsc";
import { BsCashStack } from "react-icons/bs";
import { BsMusicNoteList } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Verifica si hay token

  // Función para cerrar sesión y recargar la página
  const handleLogout = () => {
    localStorage.clear(); // Borra todo en localStorage
    sessionStorage.clear(); // Borra datos de sesión
    navigate("/login"); // Redirige al login
    window.location.reload(); // Recarga la página para reiniciar el estado
  };

  return (
    <div className="sidebar-container">
      <Link to="/profile">
        <img
          src="https://cdn-icons-png.flaticon.com/128/236/236831.png"
          className="profile-image"
          alt="profile"
        />
      </Link>
      <div>
        <SidebarButton title="Favoritos" to="/favorites" icon={<MdFavoriteBorder />} />
        <SidebarButton title="Playlists" to="/playLists" icon={<BsMusicNoteList />} />
        <SidebarButton title="Player" to="/player" icon={<FaPlay />} />
        <SidebarButton title="Libreria" to="/" icon={<IoLibrary />} />
        <SidebarButton title="Creditos" to="/credits" icon={<BsCashStack />} />
        <SidebarButton title="Archivos" to="/files" icon={<VscFileSubmodule />} />
        
        {/* Mostrar Login y Register solo si NO está logueado */}
        {!isLoggedIn && (
          <>
            <SidebarButton title="Login" to="/login" icon={<FaSignInAlt />} />
            <SidebarButton title="Register" to="/register" icon={<FaUserPlus />} />
          </>
        )}
      </div>

      {/* Mostrar Cerrar Sesión solo si está logueado */}
      {isLoggedIn && (
        <SidebarButton
          title="Cerrar Sesion"
          to="" // No necesitamos redirigir aquí porque handleLogout lo hace
          icon={<FaSignOutAlt />}
          onClick={handleLogout} // Ejecuta la función al hacer clic
        />
      )}
    </div>
  );
}