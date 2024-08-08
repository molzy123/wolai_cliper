/*global chrome*/
import ConnectHandler from "./ConnectHandler";
class ChromeCore {
  todoEventMap = new Map();
  popupConnectHandler = new ConnectHandler("popup");
  contentConnectHandler = new ConnectHandler("content");
  settingsConnectHandler = new ConnectHandler("settings");

  constructor() {}

  init() {
    this.popupConnectHandler.start();
    this.contentConnectHandler.start();
    this.settingsConnectHandler.start();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.todo) {
        if (this.todoEventMap.has(request.todo)) {
          const callbacks = this.todoEventMap.get(request.todo);
          for (let callback of callbacks) {
            callback(request, sender, sendResponse);
          }
        }
      }
    });
  }

  /**
   *
   * @param {*} key
   * @returns
   */
  async getStorage(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }

  /**
   *
   * @param {string} event
   * @param {(request,sender,sendResponse)=>void} callback
   */
  listenTodoEvent(event, callback) {
    if (!this.todoEventMap.has(event)) {
      this.todoEventMap.set(event, []);
    }
    this.todoEventMap.get(event).push(callback);
  }
}
