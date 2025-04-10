import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFileById, getFiles } from "../../api";
import Queue from "../../components/queue";
import Controls from "../../components/audioPlayer/controls";
import ProgressCircle from "../../components/audioPlayer/progressCircle";
import WaveAnimation from "../../components/audioPlayer/waveAnimation";
import SongCard from "../../components/songCard";
import Widgets from "../../components/widgets";
import "./player.css";

export default function Player() {
  const [file, setFile] = useState(null);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const { id: initialId, tipoArchivo: initialTipoArchivo, allFiles: passedFiles } = location.state || {};

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 30) return 0;
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        let filesToUse = passedFiles;
        let currentId = initialId;
        let currentTipoArchivo = initialTipoArchivo;

        // Si no hay state (ej. desde Sidebar), cargar archivos y elegir uno al azar
        if (!currentId || !currentTipoArchivo || !filesToUse) {
          const allFilesData = await getFiles();
          filesToUse = allFilesData.filter((f) => f.tipoArchivo === "audio" || f.tipoArchivo === "video");
          if (filesToUse.length === 0) {
            setError("No hay archivos reproducibles disponibles.");
            setLoading(false);
            return;
          }
          const randomIndex = Math.floor(Math.random() * filesToUse.length);
          currentId = filesToUse[randomIndex].id;
          currentTipoArchivo = filesToUse[randomIndex].tipoArchivo;
        }

        // Obtener el archivo actual
        const fileData = await getFileById(currentId);
        setFile(fileData);
        setAllFiles(filesToUse);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching file:", err);
        setError("Error al cargar el archivo.");
        setLoading(false);
      }
    };
    fetchFile();
  }, [initialId, initialTipoArchivo, passedFiles]);

  const setCurrentFile = (newId, newTipoArchivo) => {
    setIsPlaying(false);
    setTrackProgress(0);
    navigate("/player", { state: { id: newId, tipoArchivo: newTipoArchivo, allFiles } });
  };

  const handleNext = () => {
    const currentIndex = allFiles.findIndex((f) => f.id === file.id);
    const nextIndex = (currentIndex + 1) % allFiles.length;
    setCurrentFile(allFiles[nextIndex].id, allFiles[nextIndex].tipoArchivo);
  };

  const handlePrev = () => {
    const currentIndex = allFiles.findIndex((f) => f.id === file.id);
    const prevIndex = (currentIndex - 1 + allFiles.length) % allFiles.length;
    setCurrentFile(allFiles[prevIndex].id, allFiles[prevIndex].tipoArchivo);
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * allFiles.length);
    setCurrentFile(allFiles[randomIndex].id, allFiles[randomIndex].tipoArchivo);
  };

  if (loading) return <div className="screen-container">Cargando...</div>;
  if (error) return <div className="screen-container">{error}</div>;
  if (!file) return <div className="screen-container">Archivo no encontrado.</div>;

  const simulatedDuration = 30;
  const currentPercentage = (trackProgress / simulatedDuration) * 100;
  const hasQueueAndWidgets = allFiles && allFiles.length > 0;

  return (
    <div className="screen-container">
      <div className="player-body">
        <div className="left-player-body">
          <div className="simulated-player">
            <ProgressCircle
              percentage={currentPercentage}
              isPlaying={isPlaying}
              image="https://pngimg.com/uploads/vinyl/vinyl_PNG107.png"
              size={250}
              color="#FF5733"
            />
            <p className="song-title">{file.nombreArchivo || "Sin título"}</p>
            <div className="player-controls">
              <div className="song-duration">
                <p className="duration">{Math.floor(trackProgress)}</p>
                <WaveAnimation isPlaying={isPlaying} />
                <p className="duration">{simulatedDuration}</p>
              </div>
              <Controls
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                handleNext={handleNext}
                handlePrev={handlePrev}
                handleRandom={handleRandom}
              />
            </div>
          </div>
          {hasQueueAndWidgets ? (
            <>
              <div className="queue-section">
                <Queue allFiles={allFiles} currentId={file.id} setCurrentFile={setCurrentFile} />
              </div>
              <div className="widgets-section">
                <Widgets allFiles={allFiles} />
              </div>
            </>
          ) : (
            <p>No hay cola ni widgets disponibles</p>
          )}
        </div>
        <div className="right-player-body">
          <SongCard file={file} tipoArchivo={file.tipoArchivo} />
        </div>
      </div>
    </div>
  );
}