import React from "react";
import FormLabel from "./FormLabel";

const CheckBox = ({ label, checked, onChange }) => {
  const handleInputChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex h-9 items-start justify-start">
      <div className="flex h-full items-center justify-start">
        <FormLabel label={label}></FormLabel>
      </div>
      <div className="flex h-full items-center justify-start">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleInputChange}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default CheckBox;
