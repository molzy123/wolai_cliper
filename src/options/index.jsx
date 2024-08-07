/*global chrome*/
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Settings from "./Settings";
import "../EventService";
const antdConfig = {
  locale: zhCN,
};

let backgroundPort = null;

// 创建一个长连接到后台脚本
backgroundPort = chrome.runtime.connect({ name: "popup" });
// 监听 popup 关闭事件
backgroundPort.onDisconnect.addListener(() => {
  backgroundPort = null;
});

document.addEventListener("DOMContentLoaded", function () {
  const root = createRoot(document.getElementById("myRoot"));
  root.render(
    <ConfigProvider {...antdConfig}>
      <Settings />
    </ConfigProvider>
  );
});

export const useBackgroundPort = () => {
  return backgroundPort;
};
