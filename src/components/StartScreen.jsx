import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export default function StartScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleStart = () => {
      navigate("/auth");
    };

    window.addEventListener("keydown", handleStart);
    window.addEventListener("click", handleStart);

    return () => {
      window.removeEventListener("keydown", handleStart);
      window.removeEventListener("click", handleStart);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white startscreen">
      <h1
        className="mb-8 text-6xl font-extrabold text-center"
        style={{
          fontFamily: "'Press Start 2P', cursive",
          textShadow: "2px 2px 0 #ff0000, 4px 4px 0 #ff7f00, 6px 6px 0 #ffff00",
          letterSpacing: "2px",
        }}
      >
        SACRED MOUNTAIN
      </h1>
      <p className="text-xl">Premi un tasto qualsiasi per iniziare</p>
    </div>
  );
}
