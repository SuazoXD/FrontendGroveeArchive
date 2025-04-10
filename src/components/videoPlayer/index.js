import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFileById } from "../../api";
import Queue from "../../components/queue";
import "./player.css";

export default function Player() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { id, tipoArchivo, allFiles } = location.state || {};

  useEffect(() => {
    const fetchFile = async () => {
      if (!id || !tipoArchivo || !allFiles) {
        setError("No se proporcionó un archivo válido o lista de archivos.");
        setLoading(false);
        return;
      }

      try {
        const fileData = await getFileById(id);
        console.log("Respuesta de la API para /Archivo/{id}:", fileData);
        setFile(fileData);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el archivo.");
        setLoading(false);
      }
    };
    fetchFile();
  }, [id, tipoArchivo, allFiles]);

  const setCurrentFile = (newId, newTipoArchivo) => {
    navigate("/player", { state: { id: newId, tipoArchivo: newTipoArchivo, allFiles } });
  };

  if (loading) return <div className="screen-container">Cargando...</div>;
  if (error) return <div className="screen-container">{error}</div>;
  if (!file) return <div className="screen-container">Archivo no encontrado.</div>;

  return (
    <div className="screen-container">
      <div className="player-body">
        <div className="left-player-body">
          <div className="simulated-player">
            <h3>Simulación de {tipoArchivo === "audio" ? "Audio" : "Video"}</h3>
            <p>Archivo: {file.nombreArchivo || "Sin título"}</p>
            <button onClick={() => alert("Reproduciendo (simulado)")}>
              Reproducir
            </button>
          </div>
          <Queue allFiles={allFiles} currentId={id} setCurrentFile={setCurrentFile} />
        </div>
        <div className="right-player-body">
          <h2>{file.nombreArchivo || "Sin título"}</h2>
          <p>Subido por: {file.usuario?.nombreUsuario || "Desconocido"}</p>
          <p>{file.metadatos || "Sin metadatos"}</p>
          <p>Fuente: {file.fuenteAlmacenamiento || "No disponible"}</p>
        </div>
      </div>
    </div>
  );
}