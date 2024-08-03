/*global chrome*/
import { createRoot } from "react-dom/client";
import Content from "./Content";

// 将content页面添加到body
const contentRoot = document.createElement("div");
contentRoot.id = "CRX-contentRoot";
document.body.appendChild(contentRoot);

// 在content下创建一个Shadow空间
const shadowRoot = contentRoot.attachShadow({ mode: "open" });

// 在这个空间下添加link节点，链接css文件
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = chrome.runtime.getURL("output.css");
shadowRoot.appendChild(styleLink);

// 再添加一个节点用于渲染React
const reactRoot = document.createElement("div");
shadowRoot.appendChild(reactRoot);

const root = createRoot(reactRoot);
root.render(<Content />);
