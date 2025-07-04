import React, { useEffect } from "react";
import "../assets/css/toast.css";

function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      {message}
    </div>
  );
}

export default Toast;
