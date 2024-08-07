/*global chrome*/
import SingleSelect from "../../components/SingleSelect";
import MultiSelect from "../../components/MultiSelect";
import Input from "../../components/Input";
import React, { useRef, useState } from "react";
import Textarea from "../../components/Textarea";
import CheckBox from "../../components/CheckBox";
// import { apiFetch } from "@/http/fetch";
// import { loginUrl } from "@/http/api";
import { useEffect } from "react";
import { ColumnType } from "../../../util/DataUtil";

import { wolai_fetch } from "../../../http/fetch";
import { EventService } from "../../../EventService";

const Note = ({ selectInfo = "" }) => {
  const settings = useRef(null);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState();
  const initSettings = () => {
    chrome.storage.sync.get(
      ["appId", "appSecret", "curDataBase", "appToken", "dataBaseInfo"],
      (result) => {
        if (
          result.appId === undefined ||
          result.appSecret === undefined ||
          result.curDataBase === undefined
        ) {
          EventService.dispatchEvent(
            "showToast",
            "please set appId、appSecret、dataBase info before ",
            "red"
          );
          return;
        }
        settings.current = {
          appId: result.appId,
          appSecret: result.appSecret,
          curDataBase: result.curDataBase,
          appToken: result.appToken,
          dataBaseStructure: result.dataBaseInfo[result.curDataBase],
        };

        // let primary filed first
        var sortArr = [];
        for (let i = 0; i < settings.current.dataBaseStructure.length; i++) {
          if (
            settings.current.dataBaseStructure[i].type === ColumnType.PRIMARY
          ) {
            sortArr.unshift(settings.current.dataBaseStructure[i]);
          } else {
            sortArr.push(settings.current.dataBaseStructure[i]);
          }
        }
        setColumns(sortArr);
        var initFormData = {};
        initFormData[sortArr[0].columnName] = selectInfo;
        setFormData(initFormData);
      }
    );
  };

  useEffect(() => {
    initSettings();
  }, []);

  const submit = () => {
    var data = {
      rows: [formData],
    };
    var url = `https://openapi.wolai.com/v1/databases/${settings.current.curDataBase}/rows`;

    wolai_fetch(
      url,
      "POST",
      data,
      (result) => {
        EventService.dispatchEvent("showToast", "Submit Success!");
        EventService.dispatchEvent("closeModal");
        chrome.runtime.sendMessage({
          todo: "updateDataBase",
          dataBase: settings.current.curDataBase,
          token: settings.current.appToken,
        });
      },
      settings.current.appToken
    );
  };

  return (
    <div className={"w-full h-full"}>
      {/* 当settings不为空时才显示 */}
      {settings.current != null ? (
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
      ) : (
        <div className="h-full w-full flex  flex-col items-center justify-center">
          <h1 className="text-gray-800 text-lg font-bold">
            Please set appId、appSecret、dataBase info before
          </h1>
          {/* 点击前往设置界面 */}
          <button
            className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={() => {
              chrome.runtime.sendMessage({ todo: "openSettings" });
            }}
          >
            前往设置
          </button>
        </div>
      )}
    </div>
  );
};

export default Note;
