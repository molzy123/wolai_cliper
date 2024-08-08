/*global chrome*/
import { useState, useEffect } from "react";
import Note from "../common/components/Note";
import { EventService } from "../common/EventService";
import NoteWin from "../common/components/NoteWin";
import Modal from "../common/components/Modal";

const Content = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [settings, setSettings] = useState(null);
  // 打开添加日志弹窗
  const showAddLogModal = (value) => {
    setSelectedText(value);
    setShowNoteModal(true);
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ todo: "getSettings" }, (response) => {
      console.log("getSettings", response);
      setSettings(response);
    });

    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
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

  const onClickRefresh = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" });
  };

  const onClickSettings = () => {
    chrome.runtime.sendMessage({ todo: "openSettings" });
  };

  const closeWin = () => {
    setShowNoteModal(false);
  };

  const submit = (formData) => {
    chrome.runtime.sendMessage(
      {
        todo: "postNote",
        data: formData,
        dataBaseId: settings.curDataBase,
      },
      (response) => {
        closeWin();
      }
    );
  };

  return (
    <div className="CRX-antd-diy">
      {showNoteModal && settings.dataBaseStructure && (
        <Modal onClose={closeWin}>
          <NoteWin
            onClose={closeWin}
            onClickRefresh={onClickRefresh}
            onClickSettings={onClickSettings}
          >
            <Note
              selectInfo={selectedText}
              columns={settings.dataBaseStructure}
              onSubmit={submit}
            ></Note>
          </NoteWin>
        </Modal>
      )}
    </div>
  );
};

export default Content;
