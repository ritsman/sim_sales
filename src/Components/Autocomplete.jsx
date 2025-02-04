import React, { useState, useRef } from "react";
import { Input } from "semantic-ui-react";

const AutoComplete = ({ options, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterOptions(value);
  };

  const filterOptions = (value) => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option.toLowerCase().includes(value.toLowerCase()) &&
          !selectedValues.includes(option)
      )
    );
    setSelectedIndex(-1);
  };

  const handleSelectOption = (option) => {
    setSelectedValues([...selectedValues, option]);
    setInputValue(option);
    inputRef.current.focus();
    setFilteredOptions([]);
    onSelect(option);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      e.preventDefault();
      handleSelectOption(filteredOptions[selectedIndex]);
    }
  };

  return (
    <div>
      <>
        <Input
          required
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
        <ul>
          {filteredOptions.map((option, i) => (
            <li
              key={i}
              onClick={() => handleSelectOption(option)}
              className={selectedIndex === i ? "selected" : ""}
            >
              {option}
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default AutoComplete;
