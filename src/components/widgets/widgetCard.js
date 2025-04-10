import React from "react";
import "./widgetCard.css";
import WidgetEntry from "./widgetEntry";

export default function WidgetCard({ title, files }) {
  return (
    <div className="widgetcard-body">
      <p className="widget-title">{title}</p>
      {files.map((file) => (
        <WidgetEntry
          key={file.id}
          title={file.nombreArchivo}
          subtitle={file.usuario?.nombreUsuario || "Desconocido"}
        />
      ))}
    </div>
  );
}