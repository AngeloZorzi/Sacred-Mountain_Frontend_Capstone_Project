import "../assets/css/flameloader.css";
import React from "react";

export default function FlameLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-pixel">
      <div className="pixel-loader-sprite" />
      <p className="mt-6 text-orange-300 text-lg tracking-wider animate-pulse">
        Caricamento...
      </p>
    </div>
  );
}
