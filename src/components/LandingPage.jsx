import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlameLoader from "./FlameLoader";

function LandingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white font-pixel text-xl select-none">
        <FlameLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-indigo-900 text-white font-pixel p-6">
      <h1 className="text-5xl mb-12 font-bold tracking-wide animate-fade-in">
        Benvenuto!
      </h1>

      <div className="flex flex-col space-y-6 w-full max-w-xs sm:max-w-sm">
        {["Nuova Partita", "Carica Partita", "Dashboard"].map((label, i) => {
          const paths = ["/game/new", "/game/load", "/dashboard"];
          return (
            <button
              key={label}
              onClick={() => navigate(paths[i])}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400"
              aria-label={label}
              tabIndex={0}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LandingPage;
