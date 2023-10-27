import React, { useState, useEffect } from "react";
import { Input, DatePicker, Select } from "antd";
import "./styles.css";

function AddEditRow(props) {
  const { field, defaultValue, onValueChange, onValidityChange } = props;
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid]);

  const handleChange = (value) => {
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const isValidDate = (dateString) => !isNaN(Date.parse(dateString));

  const renderInput = () => {
    switch (field) {
      case "date":
        return (
          <DatePicker
            defaultValue={
              isValidDate(defaultValue) ? new Date(defaultValue) : null
            } // not working well yet
            format="DD/MM/YYYY"
            className="add-edit-input"
            onChange={(date, dateString) => {
              handleChange(date ? dateString : "");
              setIsValid(!!dateString);
            }}
          />
        );
      case "amount":
        return (
          <Input
            defaultValue={
              defaultValue !== null && defaultValue !== undefined
                ? defaultValue
                : ""
            }
            type="number"
            className="add-edit-input"
            onChange={(e) => {
              const numericValue = e.target.value
                ? parseFloat(e.target.value)
                : null;
              handleChange(numericValue);
            }}
          />
        );
      case "type":
        return (
          <Select
            defaultValue={defaultValue}
            options={[
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ]}
            className="add-edit-select"
            onChange={(value) => handleChange(value)}
          />
        );
      case "note":
        return (
          <Input
            defaultValue={defaultValue}
            className="add-edit-input"
            onChange={(e) => handleChange(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return <div className="add-edit-row">{renderInput()}</div>;
}

export default AddEditRow;
