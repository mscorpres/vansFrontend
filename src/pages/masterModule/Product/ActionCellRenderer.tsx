import { Button } from "antd";
import React from "react";

const ActionCellRenderer: React.FC<ICellRendererParams> = (props) => {
  console.log("gertgertg");

  const { data } = props;

  const handleEdit = () => {
    // Implement your edit logic here
    console.log("Edit clicked for", data);
  };

  const handleDelete = () => {
    // Implement your delete logic here
    console.log("Delete clicked for", data);
  };

  return (
    <div>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
};

export default ActionCellRenderer;
