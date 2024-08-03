import React from "react";

const FormLabel = ({ label }) => {
  return (
    <label className="text-sm font-sans font-bold min-w-16 my-1 mx-2 flex-shrink-0 text-gray-700">
      {label}
      {"："}
    </label>
  );
};

export default FormLabel;
