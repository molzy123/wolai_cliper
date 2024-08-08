import React from "react";

function Modal({ onClose, children }) {
  return (
    <div className="fixed top-0 left-0 z-[10] w-full h-full flex justify-center items-center">
      {children}

      {/* Overlay that also closes modal on click */}
      <div
        className="bg-gray-600/30 absolute top-0 left-0 h-full w-full z-[-1]"
        onClick={onClose}
      />
    </div>
  );
}

export default Modal;
