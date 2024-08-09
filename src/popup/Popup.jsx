/*global chrome*/
import "../common/EventService";
import { useEffect, useState } from "react";
import NoteWin from "./../common/components/NoteWin";
import Note from "../common/components/Note";
import { ResponseState } from "../common/Type";
import Toast from "../common/components/Toast";
import UnSettingUI from "../common/components/UnSettingUI";

const Popup = () => {
  const [settings, setSettings] = useState({});
  const [toast, setToast] = useState(undefined);

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
  }, []);

  const onClickRefresh = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" }, (response) => {
      console.log("updateDataBaseResponse", response);
      setToast({
        color: "green",
        message: "refresh success",
      });
    });
  };

  const onClickSettings = () => {
    chrome.runtime.openOptionsPage();
  };

  const closeWin = () => {
    // 关闭当前窗口
    window.close();
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
    <div className="w-[500px]">
      <NoteWin
        onClose={closeWin}
        onClickRefresh={onClickRefresh}
        onClickSettings={onClickSettings}
      >
        {settings && settings.dataBaseStructure ? (
          <Note columns={settings.dataBaseStructure} onSubmit={submit}></Note>
        ) : (
          <UnSettingUI onClickSettings={onClickSettings}></UnSettingUI>
        )}
      </NoteWin>

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

export default Popup;
