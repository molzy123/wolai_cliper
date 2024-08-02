import React from 'react';

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div className="flex flex-col space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="resize-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 scrollbar-thin scrollbar-thumb-gray-400"
        style={{ overflowY: 'auto' }}
      />
    </div>
  );
};

export default Textarea;
