import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import styles from "./popup.module.less";
import Note from "./pages/Note";
import Settings from "../options/Settings";
import ToastManager from "./ToastManager";
import "../EventService";

const Popup = () => {
  return (
    <div className="w-[400px] h-[300px] overflow-x-hidden overflow-y-auto hide-scrollbar">
      <HashRouter>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          {/* <Route exact path="/" element={<Login />} /> */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route exact path="/" element={<Settings />} />
        </Routes>
      </HashRouter>
      <ToastManager></ToastManager>
    </div>
  );
};

export default Popup;
