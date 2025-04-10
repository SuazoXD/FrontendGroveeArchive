import React from "react";
import "./widgetEntry.css";

export default function WidgetEntry({ title, subtitle }) {
  return (
    <div className="entry-body flex">
      <div className="entry-right-body flex">
        <p className="entry-title">{title}</p>
        <p className="entry-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}