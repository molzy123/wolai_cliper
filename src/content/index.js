/*global chrome*/
import ReactDOM from "react-dom";
import Content from "./Content";

// 将content页面添加到body
const contentRoot = document.createElement("div");
contentRoot.id = "CRX-contentRoot";
document.body.appendChild(contentRoot);

const shadowRoot = contentRoot.attachShadow({ mode: "open" });

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = chrome.runtime.getURL("output.css");
shadowRoot.appendChild(styleLink);

const reactRoot = document.createElement("div");
shadowRoot.appendChild(reactRoot);
ReactDOM.render(<Content />, reactRoot);
