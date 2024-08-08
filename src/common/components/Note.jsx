import React, { useState, useEffect } from "react";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import Input from "./Input";
import Textarea from "./Textarea";
import CheckBox from "./CheckBox";

import { ColumnType } from "@/common/util/DataUtil";
import { EventService } from "@/common/EventService";

const Note = ({ selectInfo = "", settings, backgroundPort }) => {
  const [formData, setFormData] = useState();
  const columns = settings.dataBaseStructure;
  const initSettings = () => {};

  useEffect(() => {
    var initFormData = {};
    initFormData[columns[0].columnName] = selectInfo;
    setFormData(initFormData);
    initSettings();
  }, [columns, selectInfo]);

  const submit = () => {
    backgroundPort.postMessage({
      todo: "postNote",
      data: formData,
      dataBaseId: settings.curDataBase,
    });
    EventService.dispatchEvent("closeModal");
  };

  return (
    <div className={"w-full h-full"}>
      {/* 当settings不为空时才显示 */}
      {
        <div className="m-2">
          {/* <div className="flex items-center justify-center">
            <span className="text-lg font-sans font-semibold">
              {" "}
              Add New Note
            </span>
          </div> */}
          {columns.map((column) => {
            if (column.type === ColumnType.PRIMARY) {
              return (
                <Textarea
                  key={column.columnName}
                  label={column.columnName}
                  value={formData[column.columnName]}
                  onChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                  placeholder="Enter your name here"
                />
              );
            } else if (column.type === ColumnType.SELECT) {
              return (
                <SingleSelect
                  key={column.columnName}
                  options={column.options}
                  label={column.columnName}
                  onSelectChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                ></SingleSelect>
              );
            } else if (column.type === ColumnType.MULTI_SELECT) {
              return (
                <MultiSelect
                  key={column.columnName}
                  options={column.options}
                  label={column.columnName}
                  onSelectChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                ></MultiSelect>
              );
            } else if (column.type === "checkbox") {
              return (
                <CheckBox
                  key={column.columnName}
                  label={column.columnName}
                  onChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                ></CheckBox>
              );
            } else if (column.type === ColumnType.TEXT) {
              return (
                <Input
                  key={column.columnName}
                  label={column.columnName}
                  onChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                ></Input>
              );
            }
          })}
          <div className=" flex items-center justify-center">
            <div className="m-3">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={submit}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      }
      {
        // (
        //   <div className="h-full w-full flex  flex-col items-center justify-center">
        //     <h1 className="text-gray-800 text-lg font-bold">
        //       Please set appId、appSecret、dataBase info before
        //     </h1>
        //     {/* 点击前往设置界面 */}
        //     <button
        //       className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
        //       onClick={() => {
        //         backgroundPort.postMessage({ todo: "openSettings" });
        //       }}
        //     >
        //       前往设置
        //     </button>
        //   </div>
        // )
      }
    </div>
  );
};

export default Note;
