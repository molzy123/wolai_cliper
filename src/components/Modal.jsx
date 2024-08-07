/*global chrome*/
import React from "react";
import NoteWin from "../popup/pages/NoteWin";

function Modal({ onClose, children }) {
  const openSettingPage = () => {
    chrome.runtime.sendMessage({ todo: "openSettings" });
  };

  const refreshDataBase = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" });
  };

  return (
    <div className="fixed top-0 left-0 z-[10] w-full h-full flex justify-center items-center">
      <NoteWin onClose={onClose}>{children}</NoteWin>
      {/* Overlay that also closes modal on click */}
      <div
        className="bg-gray-600/30 absolute top-0 left-0 h-full w-full z-[-1]"
        onClick={onClose}
      />
    </div>
  );
}

export default Modal;
