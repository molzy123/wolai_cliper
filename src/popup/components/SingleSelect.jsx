import React, { useState, useRef } from "react";

const SingleSelect = ({ options, label, onSelectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const containerRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (event) => {
    if ((event.key === " " || event.key === "Enter") && inputValue.trim() !== "") {
      event.preventDefault(); // 阻止默认行为
      if (!options.includes(inputValue.trim())) {
        selectOption(inputValue.trim());
      }
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() !== "") {
      selectOption(inputValue.trim());
    }
  };

  const selectOption = (value) => {
    updateSelectedTag(value);
    setInputValue("");
    setIsOpen(false);
  };

  const updateSelectedTag = (tag) => {
    setSelectedTag(tag);
    onSelectChange && onSelectChange(tag);
  }

  const filteredOptions = options.filter(
    (option) => option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2 p-1 border border-transparent rounded focus-within:border-gray-300">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {selectedTag && (
          <span className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded">
            {selectedTag}
            <button
              onClick={() => updateSelectedTag("")}
              className="text-blue-500 hover:text-blue-700"
            >
              x
            </button>
          </span>
        )}
        {!selectedTag && (
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleBlur}
            onClick={toggleDropdown}
            className="flex-1 p-1 bg-transparent outline-none "
            placeholder="Select or type..."
          />
        )}
      </div>
      {showDropdown && (
        <ul
          className={`absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 overflow-hidden max-h-40 scrollbar-hide`}
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => selectOption(option)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleSelect;
