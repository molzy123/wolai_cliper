import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Note from "./pages/Note";
import ToastManager from "./ToastManager";
import "../EventService";
import NoteWin from "./pages/NoteWin";
import { useBackgroundPort } from "./index";

const Popup = () => {
  const backgroundPort = useBackgroundPort();
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
      <ToastManager
        addListener={(cb) => {
          backgroundPort.onMessage.addListener(cb);
        }}
      ></ToastManager>
    </div>
  );
};

export default Popup;
