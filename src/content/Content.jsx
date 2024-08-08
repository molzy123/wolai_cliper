/*global chrome*/
import { useState, useEffect } from "react";
import Note from "../common/components/Note";
import ToastManager from "../popup/ToastManager";
import { EventService } from "../common/EventService";
import { useBackgroundPort } from ".";
import NoteWin from "../common/components/NoteWin";
import Modal from "../common/components/Modal";

const Content = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const backgroundPort = useBackgroundPort();
  const [settings, setSettings] = useState(null);
  // 打开添加日志弹窗
  const showAddLogModal = (value) => {
    setSelectedText(value);
    setShowNoteModal(true);
  };

  useEffect(() => {
    const onMessage = (message) => {
      if (message.todo === "initSettings") {
        setSettings(message.data);
      }
    };
    backgroundPort.onMessage.addListener(onMessage);

    return () => {
      backgroundPort.onMessage.removeListener(onMessage);
    };
  }, [backgroundPort.onMessage]);

  useEffect(() => {
    // 监听background页面发来的消息
    chrome.runtime.onMessage.addListener((request) => {
      switch (request.todo) {
        case "add_note":
          showAddLogModal(request.data);
          break;
        default:
          break;
      }
    });

    EventService.registerEvent("closeModal", () => {
      setShowNoteModal(false);
    });
  }, []);

  return (
    <div className="CRX-antd-diy">
      {showNoteModal && (
        <Modal onClose={() => setShowNoteModal(false)}>
          <NoteWin
            onClose={() => setShowNoteModal(false)}
            backgroundPort={backgroundPort}
          >
            <Note
              selectInfo={selectedText}
              settings={settings}
              backgroundPort={backgroundPort}
            ></Note>
          </NoteWin>
        </Modal>
      )}
      <ToastManager
        addListener={(cb) => {
          backgroundPort.onMessage.addListener(cb);
        }}
      />
    </div>
  );
};

export default Content;
