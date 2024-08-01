import React, { useState, useRef } from "react";

const MultiSelect = ({ options, maxHeight }) => {
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

  const selectOption = (value) => {
    if (!selectedTags.includes(value)) {
      setSelectedTags([...selectedTags, value]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 选项过滤，并判断是否显示下拉菜单
  const filteredOptions = options.filter(
    (option) =>
      !selectedTags.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex flex-wrap gap-1 p-1 border border-transparent rounded focus-within:border-gray-300">
        {selectedTags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded"
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
          className="flex-1 p-1 bg-transparent outline-none"
          placeholder={
            selectedTags.length === 0
              ? "Type or press 'Space/Enter' to add..."
              : ""
          }
        />
      </div>
      {showDropdown && (
        <ul
          className={`absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 overflow-hidden max-h-${maxHeight} scrollbar-hide`}
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

export default MultiSelect;
