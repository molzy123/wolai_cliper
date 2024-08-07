import React, { useState, useEffect } from "react";
import Toast from "../components/Toast";
import { EventService } from "../EventService";

const ToastManager = ({ addListener }) => {
  const [toasts, setToasts] = useState([]);
  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };
  useEffect(() => {
    EventService.registerEvent("showToast", (message, color = "green") => {
      addToast(message, color);
    });

    const addToast = (message, color) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts([...toasts, { id, message, color }]);
    };

    addListener((request) => {
      if (request.todo === "showToast") {
        addToast(request.message, request.color);
      }
    });
  }, []);

  return (
    <div>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          color={toast.color}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastManager;
