import React from "react";
import FormLabel from "./FormLabel";
import TagDropdown from "./TagDropdown";
const MultiSelect = ({ options, label, onSelectChange }) => {
  return (
    <div className="relative my-2">
      <div className="flex items-start justify-start">
        <FormLabel label={label}></FormLabel>
        <TagDropdown
          options={options}
          onSelectChange={onSelectChange}
          isSingle={false}
        ></TagDropdown>
      </div>
    </div>
  );
};

export default MultiSelect;
