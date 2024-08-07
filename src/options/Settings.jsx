/*global chrome*/
import { useEffect, useRef, useState } from "react";
import Input from "../components/Input";
import { wolai_fetch } from "../http/fetch";
import { EventService } from "../EventService";
const Settings = () => {
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [dataBase, setDataBase] = useState("");
  const appToken = useRef(null);

  const updateDataBaseInfo = function () {
    chrome.runtime.sendMessage({
      todo: "updateDataBase",
      curDataBase: dataBase,
      appToken: appToken.current,
    });
  };

  const onConfirm = () => {
    chrome.storage.sync.get(["appId", "appSecret"], (result) => {
      if (result.appId === appId && result.appSecret === appSecret) {
        updateDataBaseInfo();
        return;
      } else {
        const requestData = {
          appId: appId,
          appSecret: appSecret,
        };
        wolai_fetch(
          "https://openapi.wolai.com/v1/token",
          "POST",
          requestData,
          function (result) {
            if (result.data == undefined) {
              EventService.dispatchEvent(
                "showToast",
                "appId or appSecret error",
                "red"
              );
            } else {
              appToken.current = result.data.app_token;
              chrome.storage.sync.set({
                appId: appId,
                appSecret: appSecret,
                appToken: appToken.current,
              });
              EventService.dispatchEvent("showToast", "Save Success!");
              updateDataBaseInfo();
            }
          }
        );
      }
    });
  };

  useEffect(() => {
    chrome.storage.sync.get(
      ["appId", "appSecret", "curDataBase", "appToken"],
      (result) => {
        setAppId(result.appId || "");
        setAppSecret(result.appSecret || "");
        setDataBase(result.curDataBase || "");
        appToken.current = result.appToken;
      }
    );
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
    </div>
  );
};

export default Settings;
