/*global chrome*/
import { useState, useEffect } from "react";
import "./content.module.less";
import Modal from "./components/Modal";
import Note from "../popup/pages/Note";

const Content = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addLogModalValue, setAddLogModalValue] = useState("");

  // 点击保存按钮的回调
  const onSave = () => {
    if (!addLogModalValue) {
      alert("请先输入内容");
      return;
    }
    // 在content_scripts中只能使用部分API，所以将输入的内容交给background页面处理
    chrome.runtime.sendMessage(chrome.runtime.id, {
      todo: "saveLog",
      data: addLogModalValue,
    });
    setIsModalVisible(false);
  };

  // 打开添加日志弹窗
  const showAddLogModal = (value) => {
    setAddLogModalValue(value);
    setIsModalVisible(true);
  };

  // 关闭添加日志弹窗
  const closeAddLogModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    // 监听background页面发来的消息
    chrome.runtime.onMessage.addListener((request) => {
      console.log("接收到background消息：", request);
      switch (request.todo) {
        case "addLog":
          showAddLogModal(request.data);
          break;
        case "closeModal":
          closeAddLogModal();
          break;
        default:
          break;
      }
    });
  }, []);

  return (
    <div className="CRX-antd-diy">
      {isModalVisible && (
        <Modal onClose={closeAddLogModal}>
          <Note></Note>
        </Modal>
      )}
    </div>
  );
};

export default Content;
