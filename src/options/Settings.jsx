/*global chrome*/
import { useEffect, useRef, useState } from "react";
import Input from "../common/components/Input";
import { ResponseState } from "../common/Type";
import Toast from "../common/components/Toast";

const Settings = () => {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [dataBase, setDataBase] = useState("");
  const [toast, setToast] = useState(undefined);
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
        if (response.state === ResponseState.SUCCESS) {
          setToast({
            color: "green",
            message: "Refresh success",
          });
        }
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
      chrome.runtime.sendMessage(
        {
          todo: "saveSettings",
          appId: appId,
          appSecret: appSecret,
          curDataBase: dataBase,
        },
        function (response) {
          if (response.state === ResponseState.SUCCESS) {
            setToast({
              color: "green",
              message: "Save Success",
            });
          }
        }
      );
    }
  };

  useEffect(() => {
    /**
     *
     * @param {import("../common/Type").ResponseData} response
     */
    function getSettingsSuccess(response) {
      if (response.state === ResponseState.SUCCESS) {
        setAppId(response.data.appId || "");
        setAppSecret(response.data.appSecret || "");
        setDataBase(response.data.curDataBase || "");
        appToken.current = response.data.appToken;
        settings.current = response.data;
      } else {
        console.error("getSettings failed", response.message);
      }
    }

    chrome.runtime.sendMessage({ todo: "getSettings" }, getSettingsSuccess);
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

export default Settings;
