import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import styles from "./popup.module.less";
import Note from "./pages/Note";

const Popup = () => {
  return (
    <div className={styles.container}>
      <HashRouter>
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          {/* <Route exact path="/" element={<Login />} /> */}
          <Route path="*" element={<Navigate to="/login" />} />
          <Route exact path="/" element={<Note />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default Popup;
