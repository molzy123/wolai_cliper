import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Note from "./pages/Note";
import ToastManager from "./ToastManager";
import "../EventService";
import NoteWin from "./pages/NoteWin";

const Popup = () => {
  const closeWin = () => {
    // 关闭当前窗口
    window.close();
  };

  return (
    <div className="">
      <NoteWin onClose={closeWin}>
        {" "}
        <Note></Note>{" "}
      </NoteWin>
      <ToastManager></ToastManager>
    </div>
  );
};

export default Popup;
