/*global chrome*/
export default class ConnectHandler {
  constructor(name) {
    this.name = name;
    this.onMessageCallBackList = [];
    this.onConnectCallBackList = [];
    this.onDisconnectCallBackList = [];
  }

  addOnConnectCallBack(callback) {
    this.onConnectCallBackList.push(callback);
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
    var handler = this;
    chrome.runtime.onConnect.addListener((port) => {
      handler.port = port;
      console.log("onConnect", port.name, this.name);

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
      console.log("ConnectHandler start", handler);
    });
  }

  sendMessage(msg) {
    if (this.port === undefined) {
      console.log(this);

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
