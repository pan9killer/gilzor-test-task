import React from "react";
import { Dropdown, Menu } from "antd";
import "./styles.css";

const ActionDropdown = ({ record, onEdit, onDelete }) => {
  const handleMenuClick = (event) => {
    if (event.key === "edit") {
      onEdit(record);
    } else if (event.key === "delete") {
      onDelete(record);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <div
        className="ant-dropdown-link dots-menu"
        style={{ cursor: "pointer" }}
        onClick={(e) => e.preventDefault()}
      >
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </Dropdown>
  );
};

export default ActionDropdown;
