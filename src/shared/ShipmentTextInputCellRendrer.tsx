import React, { useState, useEffect } from 'react';

interface ShipmentTextInputCellRendrerProps {
  value: any; // The current value in the cell
  node: any; // Ag-Grid row node
  colDef: any; // Column definition
  setValue: (value: any) => void; // Function to update the value in the grid
}

const ShipmentTextInputCellRendrer: React.FC<ShipmentTextInputCellRendrerProps> = ({
  value,
  setValue,
}) => {
  const [inputValue, setInputValue] = useState<string>(value);

  // Handle input change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Commit the change when the input loses focus or the Enter key is pressed
  const onBlur = () => {
    setValue(inputValue);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setValue(inputValue);
    }
  };

  useEffect(() => {
    setInputValue(value); // Reset the input value when the component mounts or the value changes
  }, [value]);

  return (
    <input
      type="number"
      value={inputValue}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className="p-2 border border-gray-300 rounded-md"
    />
  );
};

export default ShipmentTextInputCellRendrer;
