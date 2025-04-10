import React from "react";
import "./queue.css";

export default function Queue({ allFiles, currentId, setCurrentFile }) {
  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="upNext">Próximos</p>
        <div className="queue-list">
          {allFiles.map((file) => (
            <div
              key={file.id}
              className={`queue-item flex ${file.id === currentId ? "active" : ""}`}
              onClick={() => setCurrentFile(file.id, file.tipoArchivo)}
            >
              <p className="track-name">{file.nombreArchivo}</p>
              <p>{file.metadatos || "Sin duración"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}