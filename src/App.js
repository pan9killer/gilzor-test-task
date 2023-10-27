import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  updateInLocalStorage,
} from "./utils/local-storage";
import "./App.css";
import ActionDropdown from "./components/action-dropdown";
import AddEditRow from "./components/add-edit-row";
import { parseDateFromDDMMYYYY } from "./utils/utils";

function App() {
  const [data, setData] = useState(getFromLocalStorage("transactions") || []);
  const [editingKey, setEditingKey] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const isValidDate = (date) => {
    return date && date.length > 0;
  };

  const isValidAmount = (amount) => {
    return (
      typeof amount === "number" ||
      (typeof amount === "string" && amount.length > 0)
    );
  };

  const isValidType = (type) => {
    return ["expense", "income"].includes(type);
  };

  const isValidNote = (note) => {
    return typeof note === "string" && note.trim() !== "";
  };

  const checkAllFieldsValidity = (record) => {
    return (
      isValidDate(record.date) &&
      isValidAmount(record.amount) &&
      isValidType(record.type) &&
      isValidNote(record.note)
    );
  };

  useEffect(() => {
    const savedData = getFromLocalStorage("transactions");
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const handleAddNew = () => {
    const newRecord = {
      key: Date.now(),
      date: "",
      amount: null,
      type: "",
      note: "",
    };
    setData([...data, newRecord]);
    setEditingKey(newRecord.key);
  };

  const handleSave = (record) => {
    if (record && record.key) {
      updateInLocalStorage("transactions", record);

      const newData = [...data];
      const index = newData.findIndex((item) => record.key === item.key);
      if (index > -1) {
        newData[index] = record;
        setData(newData);
        setEditingKey("");
      } else {
        setData((prevData) => [...prevData, record]);
      }
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
  };

  const handleDelete = (record) => {
    const existingData = getFromLocalStorage("transactions") || [];
    const newData = existingData.filter((item) => item.key !== record.key);
    saveToLocalStorage("transactions", newData);

    setData(newData);
  };

  const handleValueChange = (key, field, newVal) => {
    const updatedData = [...data];
    const item = updatedData.find((item) => item.key === key);
    if (item) {
      item[field] = newVal;
      setData(updatedData);
    }

    const isCurrentValid = checkAllFieldsValidity(item);
    setIsFormValid(isCurrentValid);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) =>
        parseDateFromDDMMYYYY(a.date) - parseDateFromDDMMYYYY(b.date),
      render: (text, record) => {
        if (record && editingKey === record.key) {
          return (
            <AddEditRow
              field="date"
              defaultValue={text}
              onValueChange={(newDate) =>
                handleValueChange(record.key, "date", newDate)
              }
            />
          );
        }
        return text ? text : "Not Set";
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (text, record) =>
        record && editingKey === record.key ? (
          <AddEditRow
            field="amount"
            defaultValue={text}
            onValueChange={(newVal) =>
              handleValueChange(record.key, "amount", newVal)
            }
          />
        ) : record && record.type ? (
          `${record.type === "expense" ? "-" : ""}${text}$`
        ) : (
          text
        ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) =>
        record && editingKey === record.key ? (
          <AddEditRow
            field="type"
            defaultValue={text}
            onValueChange={(newVal) =>
              handleValueChange(record.key, "type", newVal)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text, record) =>
        record && editingKey === record.key ? (
          <AddEditRow
            field="note"
            defaultValue={text}
            onValueChange={(newVal) =>
              handleValueChange(record.key, "note", newVal)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 70,
      render: (text, record) =>
        record && editingKey === record.key ? (
          <>
            <Button disabled={!isFormValid} onClick={() => handleSave(record)}>
              Save
            </Button>
            <Button onClick={() => setEditingKey("")}>Cancel</Button>
          </>
        ) : (
          <ActionDropdown
            record={record}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ),
    },
  ];

  return (
    <div className="App">
      <Button onClick={handleAddNew}>Add new</Button>
      <Table
        dataSource={data}
        columns={columns}
        footer={() => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total:</span>
            <span>
              {data
                .reduce(
                  (acc, curr) =>
                    curr && curr.type && curr.amount
                      ? curr.type === "income"
                        ? Number(acc) + Number(curr.amount)
                        : Number(acc) - Number(curr.amount)
                      : acc,
                  0
                )
                .toFixed(2)}
              $
            </span>
          </div>
        )}
      />
    </div>
  );
}

export default App;

