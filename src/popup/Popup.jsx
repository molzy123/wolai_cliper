import "../common/EventService";
import { useBackgroundPort } from "./index";
import { useEffect, useState } from "react";
import NoteWin from "./../common/components/NoteWin";
import Note from "../common/components/Note";
import ToastManager from "./ToastManager";

const Popup = () => {
  const backgroundPort = useBackgroundPort();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const onMessage = (message) => {
      console.log("Popup onMessage", message);

      if (message.event === "initSettings") {
        setSettings(message.data);
      }
    };
    backgroundPort.onMessage.addListener(onMessage);
    return () => {
      backgroundPort.onMessage.removeListener(onMessage);
    };
  }, [backgroundPort.onMessage]);

  const closeWin = () => {
    // 关闭当前窗口
    window.close();
  };

  return (
    <div className="">
      {settings && (
        <>
          <NoteWin onClose={closeWin} backgroundPort={backgroundPort}>
            <Note settings={settings} backgroundPort={backgroundPort}></Note>
          </NoteWin>
          {/* <ToastManager
            addListener={(cb) => {
              backgroundPort.onMessage.addListener(cb);
            }}
          ></ToastManager> */}
        </>
      )}
    </div>
  );
};

export default Popup;
