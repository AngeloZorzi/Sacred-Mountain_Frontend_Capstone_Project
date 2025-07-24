import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import "../assets/css/sacredmountain.css";
import FlameLoader from "./FlameLoader";
import SceneSprite from "./SceneSprite";

function GameView() {
  const [scene, setScene] = useState(null);
  const [userId, setUserId] = useState(null);
  const [storyState, setStoryState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    const fetchInitialData = async () => {
      try {
        const { data: user } = await axiosClient.get("/api/user/me");
        setUserId(user.id);
        setStoryState(user.storyState);

        const endpoint = mode === "load" ? "/api/game/load" : "/api/game/start";
        const { data: sceneData } = await axiosClient.get(endpoint);
        setScene(sceneData);

        const { data: updatedUser } = await axiosClient.get("/api/user/me");
        setStoryState(updatedUser.storyState);

        setScene((prev) => ({ ...prev }));
      } catch {
        setError("Errore nel caricamento iniziale.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [mode, navigate]);

  useEffect(() => {
    if (scene && storyState) {
      setScene((prev) => ({ ...prev }));
    }
  }, [storyState]);

  useEffect(() => {
    if (!scene || !userId || !scene.lastSceneChange) return;

    const now = new Date();
    const lastChange = new Date(scene.lastSceneChange);
    const timeElapsed = (now - lastChange) / 1000;

    const delays = scene.choices
      .map((choice) => choice.availableAfterSeconds || 0)
      .filter((delay) => delay > timeElapsed);

    if (delays.length === 0) {
      const interval = setInterval(() => {
        axiosClient
          .get(`/api/game/scene/${scene.id}/user/${userId}`)
          .then((res) => {
            setScene(res.data);
            if (res.data.storyState) setStoryState(res.data.storyState);
          })
          .catch(() => {});
      }, 15000);

      return () => clearInterval(interval);
    }

    const timeRemaining = (Math.min(...delays) - timeElapsed) * 1000;
    if (timeRemaining > 0) {
      const timeout = setTimeout(() => {
        axiosClient
          .get(`/api/game/scene/${scene.id}/user/${userId}`)
          .then((res) => {
            setScene(res.data);
            if (res.data.storyState) setStoryState(res.data.storyState);
          })
          .catch(() => {});
      }, timeRemaining);

      return () => clearTimeout(timeout);
    }
  }, [scene, userId]);

  useEffect(() => {
    if (scene && audioRef.current) {
      if (scene.backgroundMusic) {
        audioRef.current.src = scene.backgroundMusic;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [scene]);
  useEffect(() => {
    console.log("SCENA ATTUALE:", scene);
  }, [scene]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowPauseMenu((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleChoice = async (choiceId) => {
    if (!scene || !userId) return;
    setLoading(true);
    setError("");

    try {
      const payload = { userId, sceneId: scene.id, choiceId };
      const { data } = await axiosClient.post("/api/game/choice", payload);

      if (data && data.nextScene) {
        setScene(data.nextScene);
        if (data.storyState) setStoryState(data.storyState);
        else if (data.nextScene.storyState)
          setStoryState(data.nextScene.storyState);
        else {
          const { data: updatedUser } = await axiosClient.get("/api/user/me");
          setStoryState(updatedUser.storyState);
        }
      } else {
        setError("Scena successiva non trovata.");
      }
    } catch {
      setError("Errore nell'invio della scelta.");
    } finally {
      setLoading(false);
    }
  };

  const getVisibleChoices = () => {
    if (!scene || !scene.choices || !scene.lastSceneChange || !storyState)
      return [];

    const now = new Date();
    const lastChange = new Date(scene.lastSceneChange);
    const elapsed = (now - lastChange) / 1000;

    const userFlags = {
      ...storyState.extra,
      corvoPresente: storyState.corvoPresente,
      hasAmuleto: storyState.hasAmuleto,
    };

    return scene.choices.filter((choice) => {
      const delayOk =
        !choice.availableAfterSeconds ||
        elapsed >= choice.availableAfterSeconds;

      const flagsOk = choice.requiredFlags.every(
        (flag) => userFlags[flag] === true
      );

      return delayOk && flagsOk;
    });
  };

  if (loading)
    return (
      <div>
        <FlameLoader />
      </div>
    );

  if (error) return <div className="error-screen">{error}</div>;

  if (!scene)
    return <div className="no-scene-screen">Nessuna scena disponibile.</div>;

  return (
    <div className="game-view-container">
      <audio ref={audioRef} loop preload="auto" />
      <h1 className="scene-title">{scene.title}</h1>

      <p className="scene-text">{scene.text}</p>

      <div>
        <SceneSprite sceneId={scene.id} />
      </div>

      {showPauseMenu && (
        <div className="pause-toast">
          <div className="pause-toast-content">
            <p>Hai messo in pausa il gioco</p>
            <div className="pause-buttons">
              <button onClick={() => setShowPauseMenu(false)}>
                Riprendi partita
              </button>
              <button onClick={() => navigate("/landing")}>Esci</button>
            </div>
          </div>
        </div>
      )}

      {scene.isFinale ? (
        <div className="final-buttons">
          <button className="btn-restart" onClick={() => navigate("/game")}>
            Ricomincia
          </button>
          <button className="btn-exit" onClick={() => navigate("/landing")}>
            Esci
          </button>
        </div>
      ) : (
        <div className="choices-list">
          {getVisibleChoices().map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice.id)}
              className="choice-button"
              aria-label={`Scegli: ${choice.text}`}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GameView;
