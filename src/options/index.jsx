/*global chrome*/
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Settings from "./Settings";
import "../common/EventService";
const antdConfig = {
  locale: zhCN,
};

document.addEventListener("DOMContentLoaded", function () {
  const root = createRoot(document.getElementById("myRoot"));
  root.render(
    <ConfigProvider {...antdConfig}>
      <Settings />
    </ConfigProvider>
  );
});
