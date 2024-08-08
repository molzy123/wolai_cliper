/*global chrome*/
import { wolai_fetch } from "../common/http/fetch";
import DataUtil from "../common/util/DataUtil";
import ConnectHandler from "./ConnectHandler";
import { ColumnType } from "../common/util/DataUtil";

const popupConnectHandler = new ConnectHandler("popup");
popupConnectHandler.start();
const contentConnectHandler = new ConnectHandler("content");
contentConnectHandler.start();
const settingsConnectHandler = new ConnectHandler("settings");
settingsConnectHandler.start();

var settings = null;

const commonReceiveMessage = (msg, handler) => {
  if (msg.todo === "updateDataBase") {
    updateDataBase(msg.appToken, msg.curDataBase, handler);
  } else if (msg.todo === "openSettings") {
    open_setting_page();
  } else if (msg.todo === "postNote") {
    postNote(msg.data, msg.dataBaseId, handler);
  }
};

const postNote = (row, dataBaseId, handler) => {
  var data = {
    rows: [row],
  };
  var url = `https://openapi.wolai.com/v1/databases/${dataBaseId}/rows`;
  wolai_fetch(url, "POST", data, (result) => {
    updateDataBase(null, dataBaseId, handler);
  });
};

const updateDataBase = (appToken, dataBaseId, handler) => {
  if (appToken === undefined) {
    appToken = settings.appToken;
  }
  if (dataBaseId === undefined) {
    dataBaseId = settings.curDataBase;
  }
  wolai_fetch(
    `https://openapi.wolai.com/v1/databases/${dataBaseId}`,
    "GET",
    undefined,
    function (result) {
      if (result.error_code !== undefined) {
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
      dataBaseInfo[dataBaseId] = columnInfo;
      console.log(columnInfo);
      chrome.storage.sync.set({ dataBaseInfo: dataBaseInfo });
      chrome.storage.sync.set({ curDataBase: dataBaseId });
      handler.showToast("Refresh Success!", "green");
    },
    appToken
  );
};

const commonSendMessage = (msg) => {
  console.log("commonSendMessage", msg);

  popupConnectHandler.sendMessage(msg);
  contentConnectHandler.sendMessage(msg);
  settingsConnectHandler.sendMessage(msg);
};

popupConnectHandler.addOnMessageCallBack(commonReceiveMessage);
contentConnectHandler.addOnMessageCallBack(commonReceiveMessage);
settingsConnectHandler.addOnMessageCallBack(commonReceiveMessage);

popupConnectHandler.addOnConnectCallBack((handler) => {
  console.log("popupConnectHandler onConnect send settings", settings);

  handler.sendMessage({ event: "initSettings", data: settings });
});

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

const open_note = (data) => {
  contentConnectHandler.sendMessage({
    todo: "add_note",
    data: data,
  });
};

const open_setting_page = () => {
  chrome.runtime.openOptionsPage();
};

const onInitSettings = (data) => {
  var dataBaseStructure = data.dataBaseStructure;
  // let primary filed first
  var sortArr = [];
  for (let i = 0; i < dataBaseStructure.length; i++) {
    if (dataBaseStructure[i].type === ColumnType.PRIMARY) {
      sortArr.unshift(dataBaseStructure[i]);
    } else {
      sortArr.push(dataBaseStructure[i]);
    }
  }
  settings = data;
};

chrome.storage.sync.get(
  ["appId", "appSecret", "curDataBase", "appToken", "dataBaseInfo"],
  (result) => {
    console.log(result);

    if (
      result.appId === undefined ||
      result.appSecret === undefined ||
      result.curDataBase === undefined
    ) {
      return;
    }
    var settings = {
      appId: result.appId,
      appSecret: result.appSecret,
      curDataBase: result.curDataBase,
      appToken: result.appToken,
      dataBaseStructure: result.dataBaseInfo[result.curDataBase],
    };

    onInitSettings(settings);
  }
);

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
  if (command === "open_popup") {
    open_note();
  }
});

