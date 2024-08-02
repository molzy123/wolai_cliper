/*global chrome*/
import { useEffect, useRef, useState } from "react";
import Input from "../popup/components/Input";
import { wolai_fetch } from "../http/fetch";
import  DataUtil  from "../util/DataUtil";

const Settings = () => {
  
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const [dataBase, setDataBase] = useState("");
  const appToken = useRef(null);

  const updateDataBaseInfo = function () {
    wolai_fetch(`https://openapi.wolai.com/v1/databases/${dataBase}`,"GET",undefined,function(result){
      if(result.error_code != undefined){
        alert(result.message)
        return;
      }
      const columnInfo = DataUtil.extractColumnInfo(result)
      var dataBaseInfo = {}
      dataBaseInfo[dataBase] = columnInfo
      chrome.storage.sync.set({"dataBaseInfo":dataBaseInfo})
      chrome.storage.sync.set({"curDataBase":dataBase})
    },appToken.current)
  }

  const onConfirm = () => {
    chrome.storage.sync.get(["appId", "appSecret"], (result) => {
      if(result.appId === appId && result.appSecret === appSecret){
        updateDataBaseInfo();
        return;
      }else{
        const requestData ={
          "appId": appId,
          "appSecret": appSecret
        }
        wolai_fetch("https://openapi.wolai.com/v1/token","POST",requestData,function(result){
          if(result.data == undefined){
            alert("appId或appSecret错误");
          }else{
            appToken.current = result.data.app_token;
            chrome.storage.sync.set({ "appId": appId, "appSecret": appSecret,"appToken": appToken.current });
            updateDataBaseInfo();
          }
        })
      }
    })
  }

  useEffect(() => {
    chrome.storage.sync.get(["appId", "appSecret", "curDataBase", "appToken"], (result) => {
      setAppId(result.appId || "");
      setAppSecret(result.appSecret || "");
      setDataBase(result.curDataBase || "");
      appToken.current = result.appToken;
    });
  }, []);

  return (
    <div className="w-1/4">
      <Input label="AppId" value={appId} onChange={setAppId} placeholder="Enter your AppId" />
      <Input label="AppSecret" value={appSecret} onChange={setAppSecret} placeholder="Enter your AppSecret" />
      <Input label="DataBase" value={dataBase} onChange={setDataBase} placeholder="Enter your DataBase" />
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={onConfirm}
        >
          确认
        </button>
      </div>
    </div>
  );
};

export default Settings;
