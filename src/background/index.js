/*global chrome*/
import { wolai_fetch } from "../http/fetch";
import DataUtil from "../util/DataUtil";
import ConnectHandler from "./ConnectHandler";

const popupConnectHandler = new ConnectHandler("popup");
popupConnectHandler.start();
const contentConnectHandler = new ConnectHandler("content");
contentConnectHandler.start();
const settingsConnectHandler = new ConnectHandler("settings");
settingsConnectHandler.start();

const commonReceiveMessage = (msg, handler) => {
  if (msg.todo === "updateDataBase") {
    chrome.storage.sync.get(["appToken", "curDataBase"], (result) => {
      const dataBase = msg.curDataBase ? msg.curDataBase : result.curDataBase;
      const token = msg.appToken ? msg.appToken : result.appToken;
      wolai_fetch(
        `https://openapi.wolai.com/v1/databases/${dataBase}`,
        "GET",
        undefined,
        function (result) {
          if (result.error_code != undefined) {
            handler.showToast(result.message, "red");
            return;
          }
          var columnInfo = {};
          try {
            columnInfo = DataUtil.extractColumnInfo(result);
          } catch (e) {
            console.log(e);
            return;
          }
          var dataBaseInfo = {};
          dataBaseInfo[dataBase] = columnInfo;
          console.log(columnInfo);
          chrome.storage.sync.set({ dataBaseInfo: dataBaseInfo });
          chrome.storage.sync.set({ curDataBase: dataBase });
          handler.showToast("Refresh Success!", "green");
        },
        token
      );
    });
  } else if (msg.todo === "openSettings") {
    open_setting_page();
  }
};

popupConnectHandler.addOnMessageCallBack(commonReceiveMessage);
contentConnectHandler.addOnMessageCallBack(commonReceiveMessage);
settingsConnectHandler.addOnMessageCallBack(commonReceiveMessage);

// 创建上下文菜单
const contextMenus = [{ id: "add_note", title: "Add Note & Edit" }];

for (let menu of contextMenus) {
  chrome.contextMenus.create({
    id: menu.id,
    type: "normal",
    title: menu.title,
    contexts: ["selection"], // 右键点击选中文字时显示
    documentUrlPatterns: ["<all_urls>"], // 限制菜单选项仅应用于URL匹配给定模式之一的页面
  });
}

// 监听上下文菜单点击事件
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.selectionText) {
    switch (info.menuItemId) {
      case "add_note":
        open_note(info.selectionText);
        break;
      default:
        break;
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {});

// 监听系统消息通知的按钮点击事件
chrome.notifications.onButtonClicked.addListener((notificationId) => {
  switch (notificationId) {
    case "overTheLimit":
      open_setting_page();
      break;
    default:
      break;
  }
});

chrome.commands.onCommand.addListener(function (command) {
  if (command == "open_popup") {
    open_note();
  }
});

const open_note = (data) => {
  contentConnectHandler.sendMessage({
    todo: "add_note",
    data: data,
  });
};

const open_setting_page = () => {
  chrome.runtime.openOptionsPage();
};
