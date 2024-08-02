import React, { useState, useRef } from "react";
import FormLabel from "./FormLabel";
const MultiSelect = ({ options, label, onSelectChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const containerRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (event) => {
    // 处理空格和回车键，添加新标签
    if (
      (event.key === " " || event.key === "Enter") &&
      inputValue.trim() !== ""
    ) {
      event.preventDefault(); // 阻止默认行为
      if (
        !selectedTags.includes(inputValue.trim()) &&
        !options.includes(inputValue.trim())
      ) {
        selectOption(inputValue.trim());
      }
    }
  };

  const updateSelectedTags = (tags) => {
    setSelectedTags(tags);
    onSelectChange && onSelectChange(tags);
  };

  const selectOption = (value) => {
    if (!selectedTags.includes(value)) {
      updateSelectedTags([...selectedTags, value]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleBlur = () => {
    if (inputValue.trim() !== "") {
      selectOption(inputValue.trim());
    }
  };

  const removeTag = (tag) => {
    updateSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 选项过滤，并判断是否显示下拉菜单
  const filteredOptions = options.filter(
    (option) =>
      !selectedTags.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div className="relative my-2" ref={containerRef}>
      <div className="flex items-start justify-start">
        <FormLabel label={label}></FormLabel>
        <div className="flex-grow">
          <div className="flex w-full p-1 border-gray-300 border rounded-md">
            {selectedTags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 ml-1 bg-blue-100 px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  x
                </button>
              </span>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onClick={toggleDropdown}
              onBlur={handleBlur}
              className="flex-grow py-1 px-2 bg-transparent outline-none"
              placeholder={
                selectedTags.length === 0
                  ? "Type or press 'Space/Enter' to add..."
                  : ""
              }
            />
          </div>
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

export default MultiSelect;
