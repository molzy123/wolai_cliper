import React from "react";
import FormLabel from "./FormLabel";
const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex items-start justify-start">
      {label && <FormLabel label={label}></FormLabel>}
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="resize-none flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 scrollbar-thin scrollbar-thumb-gray-400"
        style={{ overflowY: "auto" }}
      />
    </div>
  );
};

export default Textarea;
