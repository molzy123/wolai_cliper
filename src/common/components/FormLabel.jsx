import React from "react";

const FormLabel = ({ label }) => {
  return (
    <div className="flex-shrink-0 min-w-16 max-w-20 my-1 mx-2">
      <div className="block text-sm font-sans font-bold break-words text-gray-700">
        {label}
        {"："}
      </div>
    </div>
  );
};

export default FormLabel;
