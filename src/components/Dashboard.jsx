import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import FlameLoader from "./FlameLoader";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSceneText, setCurrentSceneText] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const MIN_LOADING_TIME = 2000;
  const start = Date.now();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    axiosClient
      .get("/api/user/me")
      .then((res) => {
        setUser(res.data);
        console.log("USER DATA:", res.data);

        const lastSceneId = res.data.lastSceneId;
        console.log("lastSceneId:", lastSceneId);
        const sceneEndpoint =
          lastSceneId && lastSceneId > 0 ? "/api/game/load" : "/api/scenes/1";

        axiosClient
          .get(sceneEndpoint)
          .then((sceneRes) => {
            setCurrentSceneText(sceneRes.data.text);
          })
          .catch(() => setCurrentSceneText(null));
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/auth");
      })
      .finally(() => {
        const elapsed = Date.now() - start;
        const remaining = MIN_LOADING_TIME - elapsed;
        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      });
    axiosClient
      .get("/api/user/leaderboard")
      .then((res) => setLeaderboard(res.data))
      .catch(() => setLeaderboard([]));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white font-pixel text-xl select-none">
        <FlameLoader />
      </div>
    );
  }

  if (!user) {
    return <FlameLoader />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white font-pixel p-8 flex flex-col items-center text-center">
        <h1 className="text-5xl mb-10 dashboard-title">
          BENVENUTO {user.username.toUpperCase()}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl text-break">
          <div
            className="dashboard-card leaderboard"
            onClick={() => setShowModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
          >
            <h2>Score</h2>
            <ul className="leaderboard-list text-lg text-yellow-200">
              {leaderboard.length === 0 && <li>Nessun dato disponibile</li>}
              {leaderboard.map((entry, index) => (
                <li key={index} title={`${entry.username}: ${entry.score}`}>
                  <span className="truncate-text max-w-[140px] inline-block text-left">
                    {entry.username}
                  </span>
                  <span className="truncate-text font-mono max-w-[60px] inline-block text-right">
                    {entry.score}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dashboard-card border-red-700 flex flex-col items-center cursor-default">
            <h2>Punteggio</h2>
            <p className="text-3xl font-extrabold truncate-text max-w-full">
              {user.score}
            </p>
          </div>
          <div
            className="dashboard-card border-red-700 hover:bg-indigo-900 transition cursor-pointer"
            onClick={() => setShowStoryModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowStoryModal(true)}
          >
            <h2>Storia</h2>
            <p className="text-xs sm:text-sm text-indigo-200 whitespace-pre-wrap break-words max-w-full">
              {currentSceneText
                ? currentSceneText.split(" ").slice(0, 10).join(" ") + "..."
                : "Nessuna storia salvata"}
            </p>
          </div>
          {user.role === "ADMIN" && (
            <div className="dashboard-card admin flex flex-col items-center">
              <h2>Gestisci Utenti</h2>
              <button
                onClick={() => navigate("/admin/users")}
                className="pixel-button mt-auto"
              >
                Apri
              </button>
            </div>
          )}
        </div>

        <button
          className="pixel-button mt-12 bg-amber-400 hover:bg-amber-500"
          onClick={() => navigate("/landing")}
          aria-label="Torna Indietro"
        >
          TORNA INDIETRO
        </button>

        <button
          className="pixel-button-logout mt-12"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/auth");
          }}
          aria-label="Logout"
        >
          LOGOUT
        </button>
      </div>
      {showStoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="pixel-box w-full max-w-2xl relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-4 text-3xl text-indigo-300 hover:text-red-500 focus:outline-none"
              onClick={() => setShowStoryModal(false)}
              aria-label="Chiudi Storia"
            >
              &times;
            </button>

            <h2 className="text-2xl mb-4 text-center font-pixel text-indigo-300">
              STORIA SALVATA
            </h2>

            <div className="max-h-64 overflow-y-auto text-sm bg-gray-800 p-4 rounded border border-gray-700 text-indigo-100 whitespace-pre-wrap">
              {currentSceneText ? currentSceneText : "Nessuna storia salvata"}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="pixel-button"
                onClick={() => setShowStoryModal(false)}
              >
                Chiudi
              </button>
              {user.lastSceneId ? (
                <button
                  className="pixel-button"
                  onClick={() => navigate("/game?mode=load")}
                >
                  Riprendi
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Chiudi Leaderboard"
            >
              &times;
            </button>
            <h2 className="modal-title">Leaderboard Completa</h2>
            <ul className="text-yellow-200 text-lg">
              {leaderboard.length === 0 && <li>Nessun dato disponibile</li>}
              {leaderboard.map((entry, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b border-yellow-700 py-3"
                  title={`${entry.username}: ${entry.score}`}
                >
                  <span className="truncate-text max-w-[70%]">
                    {entry.username}
                  </span>
                  <span className="font-mono">{entry.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
