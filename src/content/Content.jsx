/*global chrome*/
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import Note from "../popup/pages/Note";
import ToastManager from "../popup/ToastManager";
import { EventService } from "../EventService";

const Content = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  // 打开添加日志弹窗
  const showAddLogModal = (value) => {
    setSelectedText(value);
    setShowNoteModal(true);
  };

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
          <Note selectInfo={selectedText}></Note>
        </Modal>
      )}
      <ToastManager></ToastManager>
    </div>
  );
};

export default Content;
