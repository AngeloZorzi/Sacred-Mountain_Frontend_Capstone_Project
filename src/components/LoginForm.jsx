import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/landing");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Credenziali errate o utente non esistente");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center p-6 font-pixel-retro text-white">
      <div className="max-w-md w-full pixel-box">
        <h2 className="text-3xl mb-8 text-center tracking-widest font-pixel">
          LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-2 uppercase text-xs tracking-widest font-pixel"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              required
              className="pixel-input w-full"
            />
          </div>

          <div>
            <label
              className="block mb-2 uppercase text-xs tracking-widest font-pixel"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="pixel-input w-full"
            />
          </div>

          {error && (
            <div className="bg-red-700 text-red-200 p-2 rounded text-center text-sm">
              {error}
            </div>
          )}

          <button type="submit" className="pixel-button w-full">
            Accedi
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400 tracking-widest font-pixel">
          Non hai un account?{" "}
          <Link to="/register" className="pixel-link">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
