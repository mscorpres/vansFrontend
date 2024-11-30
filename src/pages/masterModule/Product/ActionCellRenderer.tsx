import { Button } from "antd";
import React from "react";

const ActionCellRenderer: React.FC<ICellRendererParams> = (props) => {

  const { data } = props;

  const handleEdit = () => {
    // Implement your edit logic here
  };

  const handleDelete = () => {
    // Implement your delete logic here
  };

  return (
    <div>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </div>
  );
};

export default ActionCellRenderer;
