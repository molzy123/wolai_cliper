/*global chrome*/
import { wolai_fetch } from "../common/http/fetch";
import DataUtil from "../common/util/DataUtil";

/**
 * @typedef {Object} SettingInfo
 * @property {string} appId
 * @property {string} appSecret
 * @property {string} appToken
 * @property {string} curDataBase
 * @property {object} dataBaseStructure
 */

/**
 * @type {SettingInfo}
 */
var settings = {};

const commonReceiveMessage = (msg, sendResponse) => {
  if (msg.todo === "updateDataBase") {
    return updateDataBase(msg.appToken, msg.curDataBase, sendResponse);
  } else if (msg.todo === "openSettings") {
    return open_setting_page();
  } else if (msg.todo === "postNote") {
    return postNote(msg.data, msg.dataBaseId, sendResponse);
  } else if (msg.todo === "saveSettings") {
    return saveSettings(
      msg.appId,
      msg.appSecret,
      msg.curDataBase,
      sendResponse
    );
  }
};

/**
 * @param {string} appId
 * @param {string} appSecret
 * @param {string} curDataBase 当前数据库id
 * @param {(msg:string)=>Void} sendResponse
 */
const saveSettings = (appId, appSecret, curDataBase, sendResponse) => {
  const requestData = {
    appId: appId,
    appSecret: appSecret,
  };
  wolai_fetch(
    "https://openapi.wolai.com/v1/token",
    "POST",
    requestData,
    function (result) {
      const appToken = result.data.app_token;
      chrome.storage.sync.set({
        appId: appId,
        appSecret: appSecret,
        appToken: appToken,
      });
      settings.appId = appId;
      settings.appSecret = appSecret;
      settings.appToken = appToken;
      sendResponse({ state: "success" });
      updateDataBase(appToken, curDataBase, sendResponse);
    }
  );
  return true;
};

const postNote = (row, dataBaseId, sendResponse) => {
  console.log("postNote databaseid", dataBaseId);
  var data = {
    rows: [row],
  };
  var url = `https://openapi.wolai.com/v1/databases/${dataBaseId}/rows`;
  wolai_fetch(
    url,
    "POST",
    data,
    (result) => {
      sendResponse({ state: "success" });
      updateDataBase(null, dataBaseId);
    },
    settings.appToken
  );
  return true;
};

/**
 *
 * @param {string} dataBaseId
 * @param {(msg:any)=>Void} sendResponse
 * @param {any} result
 * @returns {boolean}
 */
const onGetDataBaseSuccess = (dataBaseId, sendResponse, result) => {
  if (result.error_code !== undefined) {
    return;
  }
  var columnInfo = {};
  try {
    columnInfo = DataUtil.extractColumnInfo(result);
  } catch (e) {
    sendResponse && sendResponse({ state: "error", message: e.message });
    return;
  }
  var dataBaseInfo = {};
  dataBaseInfo[dataBaseId] = columnInfo;
  chrome.storage.sync.set({ dataBaseInfo: dataBaseInfo });
  chrome.storage.sync.set({ curDataBase: dataBaseId });
  settings.curDataBase = dataBaseId;
  settings.dataBaseStructure = DataUtil.sortColumn(columnInfo);
  sendResponse && sendResponse({ state: "success" });
};

/**
 *
 * @param {string} appToken
 * @param {string} dataBaseId
 * @param {(msg:any)=>Void} sendResponse
 * @returns
 */
const updateDataBase = (appToken, dataBaseId, sendResponse) => {
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
    onGetDataBaseSuccess.bind(null, dataBaseId, sendResponse),
    appToken
  );
  return true;
};

/**
 * @param {string} id
 * @param {string} title
 */
const newContextMenus = (id, title) => {
  chrome.contextMenus.create({
    id: id,
    type: "normal",
    title: title,
    contexts: ["selection"], // 右键点击选中文字时显示
    documentUrlPatterns: ["<all_urls>"], // 限制菜单选项仅应用于URL匹配给定模式之一的页面
  });
};

newContextMenus("add_note", "Add Note & Edit");

const open_note = (data) => {
  sendToContent({
    todo: "add_note",
    data: data,
  });
};

/**
 * @param {any} msg
 */
const sendToContent = (msg) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log("sendToContent", tabs);
    var activeTab = tabs[0];
    var activeTabUrl = activeTab.url;

    // 查看是否是普通的网页
    if (!activeTabUrl.startsWith("http")) return;
    // 向content script发送消息
    chrome.tabs.sendMessage(activeTab.id, msg);
  });
};

const open_setting_page = () => {
  chrome.runtime.openOptionsPage();
};

chrome.storage.sync.get(
  ["appId", "appSecret", "curDataBase", "appToken", "dataBaseInfo"],
  (result) => {
    console.trace("initSettings", result);
    if (
      result.appId === undefined ||
      result.appSecret === undefined ||
      result.curDataBase === undefined
    ) {
      return;
    }

    settings = {
      appId: result.appId,
      appSecret: result.appSecret,
      curDataBase: result.curDataBase,
      appToken: result.appToken,
      dataBaseStructure: DataUtil.sortColumn(
        result.dataBaseInfo[result.curDataBase]
      ),
    };
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === "getSettings") {
    console.log("onGetSettings", settings);
    sendResponse(settings);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  return commonReceiveMessage(request, sendResponse);
});
