import React, { useState, useRef, useEffect } from "react";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";
import "./audioPlayer.css";

export default function AudioPlayer({ file, tipoArchivo }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const audioRef = useRef(new Audio());
  const intervalRef = useRef();

  // Asumimos que la API devuelve una URL en fuenteAlmacenamiento
  const audioSrc = file.fuenteAlmacenamiento;

  useEffect(() => {
    audioRef.current.src = audioSrc;
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    };
  }, [audioSrc]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setIsPlaying(false);
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying]);

  const handleNext = () => {
    // Lógica para siguiente archivo (pendiente de implementar)
  };

  const handlePrev = () => {
    // Lógica para archivo anterior (pendiente de implementar)
  };

  const addZero = (n) => (n > 9 ? "" + n : "0" + n);
  const duration = audioRef.current.duration || 0;
  const currentPercentage = duration ? (trackProgress / duration) * 100 : 0;

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <ProgressCircle
          percentage={currentPercentage}
          isPlaying={isPlaying}
          image="https://pngimg.com/uploads/vinyl/vinyl_PNG107.png" // Imagen genérica por ahora
          size={300}
          color="#DB5E25" // Naranja de tu paleta
        />
      </div>
      <div className="player-right-body flex">
        <p className="song-title">{file.nombreArchivo}</p>
        <p className="song-artist">{file.usuario.nombreUsuario}</p>
        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            <p className="duration">{addZero(Math.round(trackProgress))}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration">{addZero(Math.round(duration))}</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </div>
      </div>
    </div>
  );
}