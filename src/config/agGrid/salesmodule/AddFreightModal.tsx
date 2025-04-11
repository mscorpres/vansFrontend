import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addfreight } from "@/features/salesmodule/salesInvoiceSlice";

const AddFreightModal: React.FC<{ visible: boolean; onClose: () => void; invoiceNo: string }> = ({ visible, onClose, invoiceNo }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.sellInvoice);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        so_inv_id: invoiceNo,
        freight: values.freight,
        gst_rate: values.gst_rate, // Include gst_rate in the payload
      };
      const response = await dispatch(addfreight(payload));
      if (response.payload.success) {
        message.success("Freight added successfully!");
        form.resetFields();
        onClose();
      } else {
        message.error("Failed to add freight. Please try again.");
      }
    } catch (error) {
      message.error("Validation failed or an error occurred.");
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      title="Add Freight Charges"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
          Submit
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="add_freight_form">
        <Form.Item
          name="freight"
          label="Freight Amount"
          rules={[{ required: true, message: "Please input the freight amount!" }, { pattern: /^\d+(\.\d{1,2})?$/, message: "Please enter a valid number with up to 2 decimal places!" }]}
        >
          <Input type="number" placeholder="Enter freight amount" addonAfter="INR" />
        </Form.Item>
        <Form.Item
          name="gst_rate"
          label="GST Rate"
          rules={[{ required: true, message: "Please select a GST rate!" }]}
        >
          <Select placeholder="Select GST rate">
            <Select.Option value="0">0% (No GST)</Select.Option>
            <Select.Option value="5">5%</Select.Option>
            <Select.Option value="12">12%</Select.Option>
            <Select.Option value="18">18%</Select.Option>
            <Select.Option value="28">28%</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFreightModal;