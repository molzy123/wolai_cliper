import React, { useState, useRef } from "react";

const SingleSelect = ({ options, maxHeight }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const selectOption = (value) => {
    setInputValue(value);
    setIsOpen(false);
  };

  return (
    <div className={"relative"} ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onClick={toggleDropdown}
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Select or type..."
      />
      {isOpen && (
        <ul
          className={`absolute z-10 w-full bg-gray-400 border border-gray-300 rounded mt-1 overflow-hidden max-h-${maxHeight} scrollbar-hide`}
        >
          {options
            .filter((option) =>
              option.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((option, index) => (
              <li
                key={index}
                onClick={() => selectOption(option)}
                className={"p-2 hover:bg-gray-100 cursor-pointer"}
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
