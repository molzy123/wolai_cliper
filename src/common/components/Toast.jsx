import React, { useEffect, useState } from "react";

const Toast = ({ message, color, duration = 1000, onClose }) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(onClose, 300); // 延迟300ms来允许动画完成
      return () => clearTimeout(timer);
    }
  }, [isActive, onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className={`toast ${
          isActive ? "toast-slide-in" : "toast-slide-out"
        } text-md z-[99] p-3 toast-${color} rounded-lg shadow-lg`}
      >
        {message}
      </div>
    </div>
  );
};

export default Toast;
