import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFiles, getFavorites, deleteFavorite } from "../../api";
import { IconContext } from "react-icons";
import { FaHeart, FaFileAudio, FaFileVideo, FaFilePdf, FaFileArchive } from "react-icons/fa";
import { AiFillPlayCircle } from "react-icons/ai"; // Añadimos el ícono de reproducción
import "./favorites.css";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesData, favoritesData] = await Promise.all([
          getFiles(),
          getFavorites(),
        ]);
        const favoriteFiles = filesData.filter((file) =>
          favoritesData.some((fav) => fav.idArchivo === file.id)
        );
        const enrichedFavorites = favoriteFiles.map((file) => ({
          ...file,
          favoriteId: favoritesData.find((fav) => fav.idArchivo === file.id).id,
        }));
        setFavorites(enrichedFavorites || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
        setLoading(false);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const getFileIcon = (tipoArchivo) => {
    switch (tipoArchivo) {
      case "audio":
        return <FaFileAudio />;
      case "video":
        return <FaFileVideo />;
      case "documento":
        return <FaFilePdf />;
      case "archivo":
        return <FaFileArchive />;
      default:
        return <FaFileArchive />;
    }
  };

  const playFile = (id, tipoArchivo) => {
    if (tipoArchivo === "audio" || tipoArchivo === "video") {
      console.log("Enviando a Player:", { id, tipoArchivo, allFiles: favorites });
      navigate("/player", { state: { id, tipoArchivo, allFiles: favorites } });
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((fav) => fav.favoriteId !== favoriteId));
      alert("Eliminado de favoritos");
    } catch (error) {
      console.error("Error removing favorite:", error);
      alert("Error al eliminar de favoritos");
    }
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="favorites-container">
      <h1>Mis Favoritos</h1>
      <div className="favorite-list">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              <div className="favorite-icon-container">
                <IconContext.Provider value={{ size: "50px", color: "#DB5E25" }}>
                  {getFileIcon(favorite.tipoArchivo)}
                </IconContext.Provider>
              </div>
              <div className="favorite-details">
                <p className="favorite-title">{favorite.nombreArchivo}</p>
                <p className="favorite-subtitle">{favorite.metadatos}</p>
                <p className="favorite-user">Subido por: {favorite.usuario?.nombreUsuario || "Desconocido"}</p>
              </div>
              {(favorite.tipoArchivo === "audio" || favorite.tipoArchivo === "video") && (
                <div className="favorite-play" onClick={() => playFile(favorite.id, favorite.tipoArchivo)}>
                  <IconContext.Provider value={{ size: "50px", color: "#419C91" }}>
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </div>
              )}
              <div
                className="favorite-remove"
                onClick={() => handleRemoveFavorite(favorite.favoriteId)}
              >
                <IconContext.Provider value={{ size: "30px", color: "#DB5E25" }}>
                  <FaHeart />
                </IconContext.Provider>
              </div>
            </div>
          ))
        ) : (
          <p className="no-favorites">No tienes favoritos aún.</p>
        )}
      </div>
    </div>
  );
}