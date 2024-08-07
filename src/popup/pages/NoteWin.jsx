/*global chrome*/
import React from "react";
import SettingIcon from "../../icon/SettingsIcon";
import RefreshIcon from "../../icon/RefreshIcon";
import CircleButton from "./../../components/CircleButton";

function NoteWin({ onClose, children }) {
  const openSettingPage = () => {
    chrome.runtime.sendMessage({ todo: "openSettings" });
  };

  const refreshDataBase = () => {
    chrome.runtime.sendMessage({ todo: "updateDataBase" });
  };

  return (
    <div className="m-auto flex flex-col w-[500px] max-h-[500px]  bg-gray-100 border border-gray-400 rounded-md">
      {/* Header section with icon and close button */}
      <div className="flex flex-shrink-0 justify-between bg-slate-300/50 items-center border-b border-gray-400 px-3 py-2">
        {/* Icon on the left side */}
        <div className="flex items-center">
          <button className="mx-2" onClick={openSettingPage}>
            <SettingIcon className="size-4 text-gray-600"></SettingIcon>
          </button>
          <button className="mx-2" onClick={refreshDataBase}>
            <RefreshIcon className="size-4 text-gray-600"></RefreshIcon>
          </button>
        </div>
        <div className="flex items-center">
          {/* Mac style close button on the right side */}
          <CircleButton onClick={onClose}></CircleButton>
        </div>
      </div>
      <div className="bg-slate-100/50 flex-grow overflow-y-auto hide-scrollbar">
        {children}
      </div>
    </div>
  );
}

export default NoteWin;
