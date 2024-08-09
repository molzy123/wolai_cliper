import React from "react";

const UnSettingUI = ({ onClickSettings }) => {
  return (
    <div className="w-full h-full flex  flex-col items-center justify-center">
      <h1 className="text-gray-800 text-lg font-bold">
        Please set appId、appSecret、dataBase info before
      </h1>
      {/* 点击前往设置界面 */}
      <button
        className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
        onClick={onClickSettings}
      >
        前往设置
      </button>
    </div>
  );
};

export default UnSettingUI;
