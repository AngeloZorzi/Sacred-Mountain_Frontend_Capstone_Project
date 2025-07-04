import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function AdminRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/api/user/me")
      .then((res) => {
        setAuthorized(res.data.role === "ADMIN");
      })
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return null;

  return authorized ? children : <Navigate to="/dashboard" replace />;
}
