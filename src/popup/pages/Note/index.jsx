/*global chrome*/
import SingleSelect from "../../components/SingleSelect";
import MultiSelect from "../../components/MultiSelect";
import Input from "../../components/Input";
import React, { useRef, useState } from 'react';
import Textarea from "../../components/Textarea";
import CheckBox from "../../components/CheckBox";
// import { apiFetch } from "@/http/fetch";
// import { loginUrl } from "@/http/api";
import { useEffect } from "react";
import { ColumnType } from "../../../util/DataUtil";

const Note = () => {
  const settings = useRef(null);
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  const initSettings = () => {
    chrome.storage.sync.get(["appId", "appSecret", "curDataBase","appToken", "dataBaseInfo"], (result) => {
      if(result.appId === undefined || result.appSecret === undefined || result.curDataBase === undefined){
        console.error("请先设置appId、appSecret、dataBase");
        return;
      }
      settings.current = {
        appId: result.appId,
        appSecret: result.appSecret,
        curDataBase: result.curDataBase,
        appToken: result.appToken,
        dataBaseStructure: result.dataBaseInfo[result.curDataBase]
      };
    })
  }

  const initDataBaseStructure = () => {
    setColumns(settings.current.dataBaseStructure);
  }

  useEffect(() => {
    initSettings();
    initDataBaseStructure();
  }, []);

  return (
    
    <div className={"w-full"}>
      {/* 当settings不为空时才显示 */}
      {settings &&  (
        columns.map((column) => {
          if(column.type === ColumnType.TEXT){
            return <Input label={column.columnName} value="" onChange={(value)=>{
              setFormData({...formData,[column.columnName]:value})
            }} placeholder="Enter your name here"/>
          }else if(column.type === ColumnType.SELECT){
            return <SingleSelect options={column.options} label={column.columnName} onSelectChange={(value)=>{
              setFormData({...formData,[column.columnName]:value})
            }}></SingleSelect>
          }else if(column.type === ColumnType.MULTI_SELECT){
            return <MultiSelect options={column.options} label={column.columnName} onSelectChange={(value)=>{
              setFormData({...formData,[column.columnName]:value})
            }} ></MultiSelect>
          }else if(column.type === "checkbox"){
            return <CheckBox label={column.columnName} checked={isChecked} onChange={(value)=>{
              setFormData({...formData,[column.columnName]:value})
            }}></CheckBox>
          }
        })
      // 添加按钮
      
      )}
      <div>
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none" onClick={()=>{
          console.log(formData)
        }}>添加</button>
      </div>

      {/* 当settings为空时显示 */}
      {!settings && (
        <div className=" text-center">
          <h1>请先设置appId、appSecret、dataBase</h1>
          {/* 点击前往设置界面 */}
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={() => {
              chrome.tabs.create({ url: chrome.runtime.getURL("options.html") });
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
