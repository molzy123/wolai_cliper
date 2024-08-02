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

const Note = () => {
  const settings = useRef(null);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  const initSettings = () => {
    chrome.storage.sync.get(
      ["appId", "appSecret", "curDataBase", "appToken", "dataBaseInfo"],
      (result) => {
        if (
          result.appId === undefined ||
          result.appSecret === undefined ||
          result.curDataBase === undefined
        ) {
          console.error("请先设置appId、appSecret、dataBase");
          return;
        }
        settings.current = {
          appId: result.appId,
          appSecret: result.appSecret,
          curDataBase: result.curDataBase,
          appToken: result.appToken,
          dataBaseStructure: result.dataBaseInfo[result.curDataBase],
        };
        setColumns(settings.current.dataBaseStructure);
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
        window.close();
      },
      settings.current.appToken
    );
  };

  return (
    <div className={"w-full"}>
      {/* 当settings不为空时才显示 */}
      {settings ? (
        <div className="mr-2">
          <div className="flex items-center justify-center my-2">
            <span className="text-2xl"> Add New Note</span>
          </div>
          {columns.map((column) => {
            if (column.type === ColumnType.PRIMARY) {
              return (
                <Textarea
                  key={column.columnName}
                  label={column.columnName}
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
                  checked={false}
                  onChange={(value) => {
                    setFormData({ ...formData, [column.columnName]: value });
                  }}
                ></CheckBox>
              );
            }
          })}
          <div className=" flex items-center justify-center">
            <div className="mt-3">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={submit}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className=" text-center">
          <h1>请先设置appId、appSecret、dataBase</h1>
          {/* 点击前往设置界面 */}
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={() => {
              chrome.tabs.create({
                url: chrome.runtime.getURL("options.html"),
              });
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
