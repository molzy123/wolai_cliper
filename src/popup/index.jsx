/*global chrome*/
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Popup from "./Popup";
const antdConfig = {
  locale: zhCN,
};

let backgroundPort = null;
const root = createRoot(document.getElementById("root"));


// 创建一个长连接到后台脚本
backgroundPort = chrome.runtime.connect({ name: "popup" });
// 监听 popup 关闭事件
backgroundPort.onDisconnect.addListener(() => {
  console.log("Popup is closed");
});

root.render(
  <ConfigProvider {...antdConfig}>
    <Popup />
  </ConfigProvider>
);

// 自定义usePortal
export const useBackgroundPort = () => {
  return backgroundPort;
};
