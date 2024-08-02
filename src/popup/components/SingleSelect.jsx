import React, { useState, useRef } from "react";
import FormLabel from "./FormLabel";
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
    if (
      (event.key === " " || event.key === "Enter") &&
      inputValue.trim() !== ""
    ) {
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
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-start justify-start">
        <FormLabel label={label}></FormLabel>
        <div className="flex-grow">
          <div className="flex w-full border-gray-300 border rounded-md"></div>
          {selectedTag && (
            <span className="flex items-center gap-1 ml-1 bg-blue-100 px-2 py-1 rounded-full">
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
              className="flex-grow py-1 px-2 bg-transparent outline-none"
              placeholder="Select or type..."
            />
          )}
          <div className="relative w-full">
            {showDropdown && (
              <ul
                className={`absolute w-full z-10 bg-white my-2 border border-gray-300 max-h-25 rounded overflow-y-scroll  hide-scrollbar`}
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
        </div>
      </div>
    </div>
  );
};

export default SingleSelect;
