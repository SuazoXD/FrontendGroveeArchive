import React from "react";
import WidgetCard from "./widgetCard";
import "./widgets.css";

export default function Widgets({ allFiles }) {
  // Simulamos "Archivos Relacionados" tomando hasta 3 archivos de allFiles
  const relatedFiles = allFiles.slice(0, 3);

  return (
    <div className="widgets-body flex">
      <WidgetCard title="Archivos Relacionados" files={relatedFiles} />
    </div>
  );
}