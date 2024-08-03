import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Options from "./Options";
import "./index.less";
import Settings from "./Settings";
import "../EventService";
import ToastManager from "../popup/ToastManager";
const antdConfig = {
  locale: zhCN,
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider {...antdConfig}>
    <Settings />
    <ToastManager></ToastManager>
  </ConfigProvider>
);
