import React from "react";
const Tag = ({ tag, onCancel }) => {
  const handleCancel = () => {
    onCancel(tag);
  };

  return (
    <span className="flex items-center gap-1 m-[2px] font-sans font-semibold text-blue-800/80 bg-blue-100 px-2 py-[2px] rounded-full">
      {tag}
      <button
        onClick={handleCancel}
        className="text-blue-500 hover:text-blue-700"
      >
        x
      </button>
    </span>
  );
};

export default Tag;
