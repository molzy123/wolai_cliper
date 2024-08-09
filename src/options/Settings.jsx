/*global chrome*/
import { useEffect, useRef, useState } from "react";
import Input from "../common/components/Input";

/**
 * @typedef {Object} SettingInfo
 * @property {string} appId
 * @property {string} appSecret
 * @property {string} appToken
 * @property {string} curDataBase
 * @property {object} dataBaseStructure
 */

const Settings = () => {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [dataBase, setDataBase] = useState("");
  const appToken = useRef(null);
  /**
   * @type {React.MutableRefObject<SettingInfo>}
   */
  const settings = useRef({});
  const updateDataBaseInfo = function () {
    chrome.runtime.sendMessage(
      {
        todo: "updateDataBase",
        appToken: appToken.current,
        curDataBase: dataBase,
      },
      (response) => {
        console.log("updateDataBaseResponse", response);
      }
    );
  };

  const onConfirm = () => {
    if (
      settings.current.appId === appId &&
      settings.current.appSecret === appSecret
    ) {
      updateDataBaseInfo();
      return;
    } else {
      chrome.runtime.sendMessage({
        todo: "saveSettings",
        appId: appId,
        appSecret: appSecret,
        curDataBase: dataBase,
      });
    }
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ todo: "getSettings" }, (response) => {
      setAppId(response.appId || "");
      setAppSecret(response.appSecret || "");
      setDataBase(response.curDataBase || "");
      appToken.current = response.appToken;
      settings.current = response;
    });
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="p-3 w-full">
        <Input
          label="AppId"
          value={appId}
          onChange={setAppId}
          placeholder="Enter your AppId"
        />
        <Input
          label="AppSecret"
          value={appSecret}
          onChange={setAppSecret}
          placeholder="Enter your AppSecret"
        />
        <Input
          label="DataBase"
          value={dataBase}
          onChange={setDataBase}
          placeholder="Enter your DataBase"
        />
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={onConfirm}
          >
            Save
          </button>

          <button
            className="px-4 py-2 ml-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={updateDataBaseInfo}
          >
            Refresh
          </button>
        </div>
        {appToken.current && <div>Token : {appToken.current}</div>}
      </div>

      {/* <ToastManager
        addListener={(cb) => {
          backgroundPort.onMessage.addListener(cb);
        }}
      /> */}
    </div>
  );
};

export default Settings;
