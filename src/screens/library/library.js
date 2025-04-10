import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFiles, getFavorites, addFavorite } from "../../api"; // Añadimos getFavorites y addFavorite
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import { FaFileAudio, FaFileVideo, FaFilePdf, FaFileArchive, FaTh, FaList, FaHeart, FaRegHeart } from "react-icons/fa";
import "./library.css";

export default function Library() {
  const [files, setFiles] = useState(null);
  const [favorites, setFavorites] = useState([]); // Lista de favoritos
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [filesData, favoritesData] = await Promise.all([
          getFiles(),
          getFavorites(),
        ]);
        setFiles(filesData);
        setFavorites(favoritesData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/login");
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
      console.log("Enviando a Player:", { id, tipoArchivo, allFiles: files });
      navigate("/player", { state: { id, tipoArchivo, allFiles: files } });
    }
  };

  const toggleFavorite = async (fileId) => {
    try {
      const isFavorite = favorites.some((fav) => fav.idArchivo === fileId);
      if (!isFavorite) {
        const favoriteData = {
          idUsuario: files.find((f) => f.id === fileId)?.idUsuario || 21, // Ajusta según tu lógica de usuario
          idArchivo: fileId,
        };
        const newFavorite = await addFavorite(favoriteData);
        setFavorites((prev) => [...prev, newFavorite]);
        alert("Añadido a favoritos");
      } else {
        alert("Este archivo ya está en tus favoritos"); // Podríamos añadir deleteFavorite aquí
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Error al añadir a favoritos");
    }
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="screen-container flex">
      <div className="library-header">
        <h2>Librería</h2>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <FaTh />
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <FaList />
          </button>
        </div>
      </div>
      <div className={`library-body ${viewMode}`}>
        {files?.map((file) => {
          const isFavorite = favorites.some((fav) => fav.idArchivo === file.id);
          return (
            <div
              className={`file-card ${viewMode}`}
              key={file.id}
            >
              <div className="file-icon">
                <IconContext.Provider value={{ size: "50px", color: "#DB5E25" }}>
                  {getFileIcon(file.tipoArchivo)}
                </IconContext.Provider>
              </div>
              <div className="file-details">
                <p className="file-title">{file.nombreArchivo}</p>
                <p className="file-subtitle">{file.metadatos}</p>
                <p className="file-user">Subido por: {file.usuario?.nombreUsuario || "Desconocido"}</p>
              </div>
              {(file.tipoArchivo === "audio" || file.tipoArchivo === "video") && (
                <div className="file-fade" onClick={() => playFile(file.id, file.tipoArchivo)}>
                  <IconContext.Provider value={{ size: "50px", color: "#419C91" }}>
                    <AiFillPlayCircle />
                  </IconContext.Provider>
                </div>
              )}
              <div className="favorite-icon" onClick={() => toggleFavorite(file.id)}>
                <IconContext.Provider value={{ size: "30px", color: isFavorite ? "#FF914D" : "#cccccc" }}>
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </IconContext.Provider>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}