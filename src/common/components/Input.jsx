import React from "react";
import FormLabel from "./FormLabel";

const Input = ({ label, value, onChange, placeholder, type = "text" }) => {
  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex items-start justify-start my-1">
      <FormLabel label={label}></FormLabel>
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="mt-1 block flex-grow px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default Input;
