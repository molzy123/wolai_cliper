import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Popup from "./Popup";
const antdConfig = {
  locale: zhCN,
};

const root = createRoot(document.getElementById("root"));

root.render(
  <ConfigProvider {...antdConfig}>
    <Popup />
  </ConfigProvider>
);
