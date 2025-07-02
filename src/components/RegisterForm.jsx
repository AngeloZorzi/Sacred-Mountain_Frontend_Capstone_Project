import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Le password non corrispondono");
      return;
    }

    try {
      await axiosClient.post("/api/auth/register", {
        username: form.username,
        password: form.password,
      });
      navigate("/auth");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError(
        "Errore nella registrazione, username potrebbe essere già usato"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center p-6 font-pixel-retro text-white">
      <div className="max-w-md w-full pixel-box">
        <h2 className="text-2xl mb-8 text-center tracking-widest font-pixel">
          REGISTRAZIONE
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

          <div>
            <label
              className="block mb-2 uppercase text-xs tracking-widest font-pixel"
              htmlFor="confirmPassword"
            >
              Conferma Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
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
            Registrati
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400 tracking-widest font-pixel">
          Hai già un account?{" "}
          <Link to="/auth" className="pixel-link">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
