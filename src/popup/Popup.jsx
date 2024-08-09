/*global chrome*/
import "../common/EventService";
import { useEffect, useState } from "react";
import NoteWin from "./../common/components/NoteWin";
import Note from "../common/components/Note";
import { ResponseState } from "../common/Type";
import Toast from "../common/components/Toast";

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
    <div className="w-[500px] max-h-[400px]">
      {settings.dataBaseStructure && (
        <>
          <NoteWin
            onClose={closeWin}
            onClickRefresh={onClickRefresh}
            onClickSettings={onClickSettings}
          >
            <Note columns={settings.dataBaseStructure} onSubmit={submit}></Note>
          </NoteWin>
        </>
      )}

      {!settings.dataBaseStructure && (
        <div className="w-full h-full flex  flex-col items-center justify-center">
          <h1 className="text-gray-800 text-lg font-bold">
            Please set appId、appSecret、dataBase info before
          </h1>
          {/* 点击前往设置界面 */}
          <button
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={onClickSettings}
          >
            前往设置
          </button>
        </div>
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

export default Popup;
