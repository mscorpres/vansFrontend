import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addDocketNumber } from "@/features/salesmodule/salesInvoiceSlice";

type AddDocketNumberModalProps = {
  visible: boolean;
  onClose: () => void;
  invoiceNo: string;
};

const AddDocketNumberModal: React.FC<AddDocketNumberModalProps> = ({
  visible,
  onClose,
  invoiceNo,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.sellInvoice);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        so_inv_id: invoiceNo,
        dispatch_doc_no: values.dispatch_doc_no?.trim(),
      };

      const response: any = await dispatch(addDocketNumber(payload));
      if (response?.payload?.success) {
        message.success("Docket number added successfully!");
        form.resetFields();
        onClose();
        return;
      }
      message.error(response?.payload?.message || "Failed to add docket number.");
    } catch (error) {
      message.error("Validation failed or an error occurred.");
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      title="Add Docket Number"
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
      <Form form={form} layout="vertical" name="add_docket_number_form">
        <Form.Item
          name="dispatch_doc_no"
          label="Docket Number"
          rules={[
            { required: true, message: "Please enter docket number!" },
            { max: 50, message: "Docket number should be 50 characters or less." },
          ]}
        >
          <Input placeholder="Enter docket number" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDocketNumberModal;
