import React, { useState, useRef } from "react";
import FormLabel from "./FormLabel";
import TagDropdown from "./TagDropdown";
const SingleSelect = ({ options, label, onSelectChange }) => {
  const _onSelectChange = (tags) => {
    onSelectChange(tags[0]);
  };

  console.log(options);

  return (
    <div className="relative">
      <div className="flex items-start justify-start">
        <FormLabel label={label}></FormLabel>
        <TagDropdown
          options={options}
          onSelectChange={_onSelectChange}
          isSingle={true}
        ></TagDropdown>
      </div>
    </div>
  );
};

export default SingleSelect;
