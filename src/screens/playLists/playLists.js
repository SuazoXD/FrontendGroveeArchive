import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaylists, createPlaylist, getFiles, addFilesToPlaylist, getProfile, deletePlaylist } from "../../api";
import { IconContext } from "react-icons";
import { FaPlus, FaPlay, FaTrash } from "react-icons/fa";
import "./playlists.css";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [files, setFiles] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({ nombreLista: "", descripcion: "", archivos: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile();
        console.log("Perfil obtenido:", profileData);
        setUserId(profileData.idUsuario || 15);

        console.log("Iniciando solicitud a getPlaylists...");
        const playlistsData = await getPlaylists();
        console.log("Playlists recibidas:", playlistsData);

        console.log("Iniciando solicitud a getFiles...");
        const filesData = await getFiles();
        console.log("Archivos recibidos:", filesData);

        setPlaylists(playlistsData || []);
        setFiles(filesData.filter((f) => f.tipoArchivo === "audio" || f.tipoArchivo === "video"));
        setLoading(false);
      } catch (error) {
        console.error("Error detallado:", error);
        console.error("URL fallida:", error.config?.url);
        console.error("Respuesta del servidor:", error.response?.data);
        setPlaylists([]);
        setFiles([]);
        setLoading(false);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlaylist((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileToggle = (fileId) => {
    setNewPlaylist((prev) => {
      const archivos = prev.archivos.includes(fileId)
        ? prev.archivos.filter((id) => id !== fileId)
        : [...prev.archivos, fileId];
      return { ...prev, archivos };
    });
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      if (!userId) throw new Error("No se pudo obtener el ID del usuario. Por favor, recarga la página.");

      const playlistData = {
        idUsuario: userId,
        nombreLista: newPlaylist.nombreLista,
        descripcion: newPlaylist.descripcion,
      };
      console.log("Enviando playlist al backend:", playlistData);
      const createdPlaylist = await createPlaylist(playlistData);
      console.log("Playlist creada exitosamente:", createdPlaylist);

      if (newPlaylist.archivos.length > 0) {
        try {
          await addFilesToPlaylist(createdPlaylist.id, newPlaylist.archivos);
          console.log("Archivos añadidos a la lista:", newPlaylist.archivos);
          createdPlaylist.archivos = newPlaylist.archivos.map((id) => ({ idArchivo: id }));
        } catch (err) {
          console.warn("No se pudieron añadir archivos (endpoint no implementado?):", err);
        }
      }

      setPlaylists((prev) => [...prev, createdPlaylist]);
      setNewPlaylist({ nombreLista: "", descripcion: "", archivos: [] });
      alert("Lista de reproducción creada");
    } catch (error) {
      console.error("Error creating playlist:", error);
      console.error("URL fallida:", error.config?.url);
      console.error("Respuesta del servidor:", error.response?.data);
      alert("Error al crear la lista: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeletePlaylist = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("¿Estás seguro de que quieres eliminar esta lista?")) return;
    try {
      await deletePlaylist(id);
      console.log(`Lista con ID ${id} eliminada`);
      setPlaylists((prev) => prev.filter((playlist) => playlist.id !== id));
      alert("Lista de reproducción eliminada");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      console.error("URL fallida:", error.config?.url);
      console.error("Respuesta del servidor:", error.response?.data);
      alert("Error al eliminar la lista: " + (error.response?.data?.message || error.message));
    }
  };

  const playPlaylist = (playlistFiles) => {
    const playableFiles = files.filter((f) => playlistFiles.some((pf) => pf.idArchivo === f.id));
    console.log("Archivos para reproducir:", playableFiles);
    if (playableFiles.length > 0) {
      navigate("/player", {
        state: { id: playableFiles[0].id, tipoArchivo: playableFiles[0].tipoArchivo, allFiles: playableFiles },
      });
    } else {
      alert("No hay archivos reproducibles en esta lista.");
    }
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="playlists-container">
      <h1>Mis Listas de Reproducción</h1>
      <form onSubmit={handleCreatePlaylist} className="playlist-form">
        <input
          type="text"
          name="nombreLista"
          value={newPlaylist.nombreLista}
          onChange={handleInputChange}
          placeholder="Nombre de la lista"
          required
        />
        <input
          type="text"
          name="descripcion"
          value={newPlaylist.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción de la lista"
        />
        <div className="file-selector">
          {files.length > 0 ? (
            files.map((file) => (
              <div key={file.id} className="file-option">
                <input
                  type="checkbox"
                  checked={newPlaylist.archivos.includes(file.id)}
                  onChange={() => handleFileToggle(file.id)}
                />
                <span>{file.nombreArchivo}</span>
              </div>
            ))
          ) : (
            <p>No hay archivos disponibles para añadir.</p>
          )}
        </div>
        <button type="submit">
          <FaPlus /> Crear Lista
        </button>
      </form>
      <div className="playlist-list">
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              <span>{playlist.nombreLista}</span>
              <div className="playlist-actions">
                <div
                  className="play-btn"
                  onClick={() => playPlaylist(playlist.archivos || [])}
                >
                  <IconContext.Provider value={{ size: "30px", color: "#419C91" }}>
                    <FaPlay />
                  </IconContext.Provider>
                </div>
                <div
                  className="delete-btn"
                  onClick={() => handleDeletePlaylist(playlist.id)}
                >
                  <IconContext.Provider value={{ size: "30px", color: "#FF5733" }}>
                    <FaTrash />
                  </IconContext.Provider>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay listas de reproducción aún.</p>
        )}
      </div>
    </div>
  );
}