import React from 'react';

const Input = ({ label, value, onChange, placeholder, type = "text" }) => {

  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex items-center">
      <label className="block mx-2 flex-shrink-0 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="mt-1 block flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default Input;
