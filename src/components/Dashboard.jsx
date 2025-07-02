import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import FlameLoader from "./FlameLoader";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white font-pixel p-8 flex flex-col items-center">
        <h1 className="text-5xl mb-10 dashboard-title">
          BENVENUTO {user.username.toUpperCase()}!
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl">
          <div
            className="dashboard-card leaderboard"
            onClick={() => setShowModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
          >
            <h2>Leaderboard</h2>
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

          <div className="dashboard-card border-red-700">
            <h2>Storia</h2>
            <p className="text-lg text-center truncate-text">
              {user.storyState || "Nessuna storia salvata"}
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
