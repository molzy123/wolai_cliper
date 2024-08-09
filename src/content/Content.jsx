/*global chrome*/
import { useState, useEffect } from "react";
import Note from "../common/components/Note";
import { EventService } from "../common/EventService";
import NoteWin from "../common/components/NoteWin";
import Modal from "../common/components/Modal";
import { ResponseState } from "../common/Type";
import Toast from "../common/components/Toast";
import UnSettingUI from "../common/components/UnSettingUI";

const Content = () => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [settings, setSettings] = useState(null);
  const [toast, setToast] = useState(undefined);
  // 打开添加日志弹窗
  const showAddLogModal = (value) => {
    setSelectedText(value);
    setShowNoteModal(true);
  };

  useEffect(() => {
    /**
     *
     * @param {import("../common/Type").ResponseData} response
     */
    function getSettingsSuccess(response) {
      if (response.state === ResponseState.SUCCESS) {
        setSettings(response.data);
      } else {
        console.error("getSettings failed", response.message);
      }
    }

    chrome.runtime.sendMessage({ todo: "getSettings" }, getSettingsSuccess);

    /**
     *
     * @param {import("../common/Type").OpenNoteWindowReqeustData} request
     * @param {*} sender
     * @param {import("../common/Type").sendResponse} sendResponse
     */
    function onMessage(request, sender, sendResponse) {
      switch (request.todo) {
        case "add_note":
          showAddLogModal(request.selectedText);
          break;
        default:
          break;
      }
    }

    chrome.runtime.onMessage.addListener(onMessage);
    EventService.registerEvent("closeModal", () => {
      setShowNoteModal(false);
    });
  }, []);

  const onClickRefresh = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" }, (response) => {
      if (response.state === ResponseState.SUCCESS) {
        setToast({
          color: "green",
          message: "refresh success",
        });
      }
    });
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
        if (response.state === ResponseState.SUCCESS) {
          setToast({
            color: "green",
            message: "New Note Success",
          });
        }
      }
    );
  };

  console.log(showNoteModal && (!settings || !settings.dataBaseStructure));

  return (
    <div className="CRX-antd-diy">
      {showNoteModal && (
        <Modal onClose={closeWin}>
          <NoteWin
            onClose={closeWin}
            onClickRefresh={onClickRefresh}
            onClickSettings={onClickSettings}
          >
            {settings && settings.dataBaseStructure ? (
              <Note
                selectInfo={selectedText}
                columns={settings.dataBaseStructure}
                onSubmit={submit}
              ></Note>
            ) : (
              <UnSettingUI onClickSettings={onClickSettings}></UnSettingUI>
            )}
          </NoteWin>
        </Modal>
      )}

      {toast && (
        <Toast
          color={toast.color}
          message={toast.message}
          onClose={() => setToast(undefined)}
        />
      )}
    </div>
  );
};

export default Content;
