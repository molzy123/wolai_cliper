import React from "react";

const FormLabel = ({ label }) => {
  return (
    <label className="text-sm min-w-8 my-1 mx-2 flex-shrink-0 font-medium text-gray-700">
      {label}
      {"："}
    </label>
  );
};

export default FormLabel;
