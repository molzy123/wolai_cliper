import React, { useState, useRef } from "react";
import Tag from "./Tag";
import { EventService } from "../EventService";
const TagDropdown = ({ options, onSelectChange, isSingle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [hoverOptions, setHoverOptions] = useState(-1);
  const inputEl = useRef(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      if (hoverOptions !== -1) {
        selectOption(filteredOptions[hoverOptions]);
      } else {
        selectOption(inputValue);
      }
      // 处理空格和回车键，添加新标签
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件冒泡
    } else if (event.key === " ") {
      selectOption(inputValue);
      // 处理空格和回车键，添加新标签
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件冒泡
    } else if (event.key === "Backspace" && inputValue === "") {
      removeTag(selectedTags[selectedTags.length - 1]);
      // 处理空格和回车键，添加新标签
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件冒泡
    } else if (event.key === "ArrowDown") {
      setHoverOptions(
        (hoverOptions + filteredOptions.length + 1) % filteredOptions.length
      );
      // 处理空格和回车键，添加新标签
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件冒泡
    } else if (event.key === "ArrowUp") {
      setHoverOptions(
        (hoverOptions + filteredOptions.length - 1) % filteredOptions.length
      );
      // 处理空格和回车键，添加新标签
      event.preventDefault(); // 阻止默认行为
      event.stopPropagation(); // 阻止事件冒泡
    }
  };

  const updateSelectedTags = (tags) => {
    setSelectedTags(tags);
    onSelectChange && onSelectChange(tags);
  };

  const selectOption = (value) => {
    if (value === undefined) return;
    value = value.trim();
    if (value === "") return;
    if (isSingle) {
      updateSelectedTags([value]);
    } else if (!selectedTags.includes(value)) {
      updateSelectedTags([...selectedTags, value]);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleBlur = () => {
    selectOption(inputValue);
  };

  const removeTag = (tag) => {
    updateSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // 选项过滤，并判断是否显示下拉菜单
  var filteredOptions = options.filter(
    (option) =>
      !selectedTags.includes(option) &&
      option.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showDropdown = isOpen && filteredOptions.length > 0;

  return (
    <div
      className="flex-grow"
      onClick={() => {
        inputEl.current.focus();
      }}
    >
      <div className="flex flex-wrap w-full p-1 border bg-white border-gray-300 rounded-md shadow-sm placeholder-gray-400">
        {selectedTags.map((tag, index) => (
          <Tag key={index} tag={tag} onCancel={removeTag}></Tag>
        ))}
        <div className="flex-grow">
          <input
            ref={inputEl}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleBlur}
            onClick={() => setIsOpen(!isOpen)}
            className="py-1 w-full px-2 bg-transparent outline-none"
            placeholder={
              selectedTags.length === 0
                ? "Type or press 'Space/Enter' to add..."
                : ""
            }
          />
        </div>
      </div>
      <div className="relative w-full">
        {showDropdown && (
          <ul
            className={`absolute w-full z-10 bg-white border border-gray-300 shadow-lg max-h-24 rounded overflow-y-scroll  hide-scrollbar`}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => selectOption(option)}
                onMouseEnter={() => setHoverOptions(index)}
                className={`p-1 m-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans font-semibold cursor-pointer shadow-sm ${
                  index === hoverOptions ? "bg-gray-200" : ""
                } `}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagDropdown;
