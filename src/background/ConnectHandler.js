/*global chrome*/
export default class ConnectHandler {
  constructor(name) {
    this.name = name;
    this.onMessageCallBackList = [];
    this.onConnectCallBackList = [];
    this.onDisconnectCallBackList = [];
  }

  addOnMessageCallBack(callback) {
    this.onMessageCallBackList.push(callback);
  }

  removeOnMessageCallBack(callback) {
    this.onMessageCallBackList = this.onMessageCallBackList.filter(
      (cb) => cb !== callback
    );
  }

  start() {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.name) {
        return;
      }
      this.onConnectCallBackList.forEach((cb) => cb(this));
      port.onMessage.addListener((msg) => {
        this.onMessageCallBackList.forEach((cb) => cb(msg, this));
      });
      port.onDisconnect.addListener(() => {
        this.onDisconnectCallBackList.forEach((cb) => cb(this));
      });
      this.port = port;
    });
  }

  sendMessage(msg) {
    if (this.port === undefined) {
      console.error("Port is undefined");
      return;
    }
    this.port.postMessage(msg);
  }

  getPort() {
    return this.port;
  }

  showToast(message, color) {
    this.sendMessage({
      todo: "showToast",
      message: message,
      color: color,
    });
  }
}
