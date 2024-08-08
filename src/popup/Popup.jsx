/*global chrome*/
import "../common/EventService";
import { useEffect, useState } from "react";
import NoteWin from "./../common/components/NoteWin";
import Note from "../common/components/Note";

const Popup = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    chrome.runtime.sendMessage({ todo: "getSettings" }, (response) => {
      console.log("getSettings", response);
      setSettings(response);
    });
  }, []);

  const onClickRefresh = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" });
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

  console.trace("settings", settings);

  return (
    <div className="">
      {settings.dataBaseStructure && (
        <>
          <NoteWin
            onClose={closeWin}
            onClickRefresh={onClickRefresh}
            onClickSettings={onClickSettings}
          >
            <Note columns={settings.dataBaseStructure} onSubmit={submit}></Note>
          </NoteWin>
          {/* <ToastManager
            addListener={(cb) => {
              backgroundPort.onMessage.addListener(cb);
            }}
          ></ToastManager> */}
        </>
      )}

      {!settings.dataBaseStructure && (
        <div className="h-full w-full flex  flex-col items-center justify-center">
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
    </div>
  );
};

export default Popup;
