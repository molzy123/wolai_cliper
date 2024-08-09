import React, { useState, useEffect } from "react";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import Input from "./Input";
import Textarea from "./Textarea";
import CheckBox from "./CheckBox";

import { ColumnType } from "@/common/util/DataUtil";

const Note = ({ selectInfo = "", columns, onSubmit }) => {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    var initFormData = {};
    initFormData[columns[0].columnName] = selectInfo;
    setFormData(initFormData);
  }, [columns, selectInfo]);

  const onClickSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className={"w-full h-full"}>
      <div className="m-2">
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
          return null;
        })}
        <div className=" flex items-center justify-center">
          <div className="m-3">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
              onClick={onClickSubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Note;
