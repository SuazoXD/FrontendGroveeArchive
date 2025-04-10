import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFilesByUser, uploadFile, updateFile, deleteFile, getProfile } from "../../api";
import { FaFileAudio, FaFileVideo, FaFileAlt, FaGoogleDrive, FaCloudUploadAlt } from "react-icons/fa";
import { BsFileEarmark } from "react-icons/bs";
import { SiMega, SiIcloud } from "react-icons/si";
import "./files.css";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFile, setEditFile] = useState(null);
  const [newFile, setNewFile] = useState({
    nombreArchivo: "",
    tipoArchivo: "",
    fuenteAlmacenamiento: "",
    metadatos: "",
    storageOption: "google", // Opción por defecto: Google Drive
    file: null, // Para guardar el archivo seleccionado
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fileData = await getFilesByUser();
        setFiles(fileData || []); // Si no hay datos, usa un array vacío
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]); // En caso de error, muestra lista vacía
        setLoading(false);
        // Solo redirige a login si es un error de autenticación (401)
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };
    fetchFiles();
  }, [navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editFile) {
      setEditFile((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewFile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile((prev) => ({ ...prev, nombreArchivo: file.name, file }));
    }
  };

  const simulateFileUpload = (file) => {
    // Simulación de tipo y metadatos basados en el archivo
    const extension = file.name.split(".").pop().toLowerCase();
    let tipoArchivo = "other";
    let metadatos = `Subido el ${new Date().toLocaleDateString()} - Tamaño: ${(file.size / 1024).toFixed(2)} KB`;

    if (["mp3", "wav"].includes(extension)) {
      tipoArchivo = "audio";
    } else if (["mp4", "avi"].includes(extension)) {
      tipoArchivo = "video";
    }

    // Simulación de URL según la opción de almacenamiento
    let baseUrl;
    switch (newFile.storageOption) {
      case "google": baseUrl = "https://drive.google.com/file/d/"; break;
      case "onedrive": baseUrl = "https://onedrive.live.com/?id="; break;
      case "mega": baseUrl = "https://mega.nz/file/"; break;
      case "icloud": baseUrl = "https://www.icloud.com/iclouddrive/"; break;
      default: baseUrl = "https://example.com/";
    }
    const fakeId = Math.random().toString(36).substring(2, 15);
    const fuenteAlmacenamiento = `${baseUrl}${fakeId}`;

    return { tipoArchivo, metadatos, fuenteAlmacenamiento };
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newFile.file) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }
    try {
      const userProfile = await getProfile();
      const { tipoArchivo, metadatos, fuenteAlmacenamiento } = simulateFileUpload(newFile.file);
      const fileData = { 
        nombreArchivo: newFile.nombreArchivo,
        tipoArchivo,
        fuenteAlmacenamiento,
        metadatos,
        idUsuario: userProfile.id 
      };
      const uploadedFile = await uploadFile(fileData);
      setFiles((prev) => [...prev, uploadedFile]);
      setNewFile({ nombreArchivo: "", tipoArchivo: "", fuenteAlmacenamiento: "", metadatos: "", storageOption: "google", file: null });
      alert("Archivo subido con éxito");
    } catch (error) {
      alert("Error al subir el archivo");
    }
  };

  const handleEdit = (file) => {
    setEditFile(file);
  };

  const handleUpdate = async () => {
    try {
      await updateFile(editFile.id, editFile);
      setFiles((prev) => prev.map((f) => (f.id === editFile.id ? editFile : f)));
      setEditFile(null);
      alert("Archivo actualizado con éxito");
    } catch (error) {
      alert("Error al actualizar el archivo");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
      try {
        await deleteFile(id);
        setFiles((prev) => prev.filter((f) => f.id !== id));
        alert("Archivo eliminado con éxito");
      } catch (error) {
        alert("Error al eliminar el archivo");
      }
    }
  };

  const getFileIcon = (tipoArchivo) => {
    switch (tipoArchivo.toLowerCase()) {
      case "audio": return <FaFileAudio size={30} color="#FF914D" />;
      case "video": return <FaFileVideo size={30} color="#FF914D" />;
      default: return <BsFileEarmark size={30} color="#FF914D" />;
    }
  };

  if (loading) return <div className="screen-container">Cargando...</div>;

  return (
    <div className="files-container">
      <h1>Mis Archivos</h1>
      <div className="file-upload">
        <h2><FaCloudUploadAlt /> Subir Nuevo Archivo</h2>
        <form onSubmit={handleUpload} className="upload-form">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input file-upload-input"
          />
          <input
            type="text"
            name="nombreArchivo"
            value={newFile.nombreArchivo}
            onChange={handleInputChange}
            placeholder="Nombre del archivo (autocompletado)"
            className="file-input"
          />
          <select
            name="storageOption"
            value={newFile.storageOption}
            onChange={handleInputChange}
            className="file-input"
          >
            <option value="google">Google Drive</option>
            <option value="onedrive">OneDrive</option>
            <option value="mega">Mega</option>
            <option value="icloud">iCloud</option>
          </select>
          <button type="submit" className="upload-btn">
            <FaGoogleDrive /> Subir
          </button>
        </form>
      </div>

      <div className="file-list">
        {files.length > 0 ? (
          files.map((file) => (
            <div key={file.id} className="file-card">
              {editFile && editFile.id === file.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="nombreArchivo"
                    value={editFile.nombreArchivo}
                    onChange={handleInputChange}
                    className="file-input"
                  />
                  <input
                    type="text"
                    name="tipoArchivo"
                    value={editFile.tipoArchivo}
                    onChange={handleInputChange}
                    className="file-input"
                  />
                  <input
                    type="text"
                    name="fuenteAlmacenamiento"
                    value={editFile.fuenteAlmacenamiento}
                    onChange={handleInputChange}
                    className="file-input"
                  />
                  <input
                    type="text"
                    name="metadatos"
                    value={editFile.metadatos}
                    onChange={handleInputChange}
                    className="file-input"
                  />
                  <div className="file-actions">
                    <button onClick={handleUpdate} className="save-btn">Guardar</button>
                    <button onClick={() => setEditFile(null)} className="cancel-btn">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="file-details">
                  <div className="file-icon">{getFileIcon(file.tipoArchivo)}</div>
                  <div className="file-info">
                    <h3>{file.nombreArchivo}</h3>
                    <p>Tipo: {file.tipoArchivo}</p>
                    <p>Fuente: <a href={file.fuenteAlmacenamiento} target="_blank" rel="noopener noreferrer">{file.fuenteAlmacenamiento}</a></p>
                    <p>Metadatos: {file.metadatos || "N/A"}</p>
                  </div>
                  <div className="file-actions">
                    <button onClick={() => handleEdit(file)} className="edit-btn">Editar</button>
                    <button onClick={() => handleDelete(file.id)} className="delete-btn">Eliminar</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-files">No tienes archivos aún.</p>
        )}
      </div>
    </div>
  );
}