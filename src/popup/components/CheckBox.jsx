import React from "react";
import FormLabel from "./FormLabel";

const CheckBox = ({ label, checked, onChange }) => {
  const handleInputChange = (event) => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex items-start justify-start">
      <FormLabel label={label}></FormLabel>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleInputChange}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
    </div>
  );
};

export default CheckBox;
