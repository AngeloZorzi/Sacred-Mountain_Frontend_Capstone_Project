import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axiosClient
      .get("/api/user/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return <div className="container mt-5">Caricamento...</div>;
  }

  return (
    <div className="container mt-5">
      <h1>Benvenuto, {user.username}!</h1>
      <p>
        <strong>Ruolo:</strong> {user.role}
      </p>
      <p>
        <strong>Punteggio:</strong> {user.score}
      </p>
      <p>
        <strong>Storia:</strong> {user.storyState || "Nessuna storia salvata"}
      </p>
      <button
        className="btn btn-secondary mt-3"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
