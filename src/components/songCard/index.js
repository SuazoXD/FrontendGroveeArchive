import React from "react";
import "./songCard.css";

export default function SongCard({ file, tipoArchivo }) {
  const getCoverImage = (tipo) => {
    switch (tipo) {
      case "audio":
        return "https://pngimg.com/uploads/vinyl/vinyl_PNG107.png";
      case "video":
        return "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHJ6OHB3YWU2dzlieTE2eHBkOTFtZGEyem1zM3V2OG9ycHNpdmRjMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WFmjWifrj9DJ50YaXj/giphy.gif";
      default:
        return "https://images.vexels.com/media/users/3/130100/isolated/preview/1071e6146bfbbb8018d2c36358a988c4-document-circle-icon.png";
    }
  };

  return (
    <div className="songCard-body flex">
      <img src={getCoverImage(tipoArchivo)} alt="Portada" className="songCard-cover" />
      <div className="songCard-details">
        <h2 className="songCard-title">{file.nombreArchivo || "Sin título"}</h2>
        <p className="songCard-info">Subido por: {file.usuario?.nombreUsuario || "Desconocido"}</p>
        <p className="songCard-info">{file.metadatos || "Sin metadatos"}</p>
        <p className="songCard-release">Fuente: {file.fuenteAlmacenamiento || "No disponible"}</p>
      </div>
    </div>
  );
}