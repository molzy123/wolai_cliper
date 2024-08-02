import React from 'react';

const CheckBox = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
  );
};

export default CheckBox;
