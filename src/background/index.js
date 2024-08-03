/*global chrome*/
import { apiFetch } from "@/http/fetch";
import { wolai_fetch } from "../http/fetch";
import { EventService } from "../EventService";
import DataUtil from "../util/DataUtil";

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

// 监听message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === "updateDataBase") {
    chrome.storage.sync.get(["appToken", "curDataBase"], (result) => {
      const dataBase = result.curDataBase;
      const token = result.appToken;
      wolai_fetch(
        `https://openapi.wolai.com/v1/databases/${dataBase}`,
        "GET",
        undefined,
        function (result) {
          if (result.error_code != undefined) {
            showToast(result.message, "red");
            return;
          }
          const columnInfo = DataUtil.extractColumnInfo(result);
          var dataBaseInfo = {};
          dataBaseInfo[dataBase] = columnInfo;
          console.log(columnInfo);
          chrome.storage.sync.set({ dataBaseInfo: dataBaseInfo });
          chrome.storage.sync.set({ curDataBase: dataBase });
          showToast("Refresh Success!", "green");
        },
        token
      );
    });
  } else if (request.todo === "openSettings") {
    open_setting_page();
  }
});

const showToast = (message, color) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "showToast",
      message: message,
      color: color,
    });
  });
};

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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: "add_note",
      data: data,
    });
  });
};

const open_setting_page = () => {
  chrome.runtime.openOptionsPage();
};
