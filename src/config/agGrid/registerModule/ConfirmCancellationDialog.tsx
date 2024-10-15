import { Button, Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Ensure this path is correct
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Adjust import based on your component structure
import { useState } from "react";

interface ConfirmCancellationDialogProps {
  isDialogVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  row: {
    req_id: string;
  };
  form: FormInstance;
  module?: string;
  loading?: boolean;
}

const types = [
  { label: "Duplicate", value: "1" },
  { label: "Data Entry Mistake", value: "2" },
  { label: "Order Cancelled", value: "3" },
  { label: "Others", value: "4" },
];

const eWayBillTypes = [
  { label: "Duplicate", value: "1" },
  { label: "Order Cancelled", value: "2" },
  { label: "Data Entry Mistake", value: "3" },
  { label: "Others", value: "4" },
];

export function ConfirmCancellationDialog({
  isDialogVisible,
  handleOk,
  handleCancel,
  row,
  form,
  module,
  loading=false,
}: ConfirmCancellationDialogProps) {
  const [type, setType] = useState<string>("");

  return (
    <Dialog open={isDialogVisible} onOpenChange={handleCancel}>
      <DialogContent
        className="min-w-[800px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <img src="/loader.gif" alt="Loading..." className="loading-image" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Cancellation</DialogTitle>
            </DialogHeader>
            <Form form={form} layout="vertical">
              <p>
                Are you sure you want to cancel this{" "}
                {module === "E-Invoice" ? "E-Invoice" : module ? module : "SO"}{" "}
                {row.req_id}?
              </p>
              {module === "E-Invoice" && (
                <>
                  <Form.Item
                    name="reason"
                    label="Reasons for Cancellation"
                    rules={[
                      { required: true, message: "Please enter Reason!" },
                    ]}
                  >
                    <div className="p-[10px]">
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {(module === "E-Invoice" ? types : eWayBillTypes).map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </Form.Item>
                  <Form.Item
                    name="remark"
                    label="Remark"
                    rules={[
                      { required: true, message: "Please select a Remark" },
                    ]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Enter reason here"
                      style={{ height: 120, resize: "none" }}
                    />
                  </Form.Item>
                </>
              )}
              {module !== "E-Invoice" && (
                <Form.Item
                  name="remark"
                  label="Remarks"
                  rules={[{ required: true, message: "Please enter remarks!" }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Enter remarks here"
                    style={{ height: 120, resize: "none" }}
                  />
                </Form.Item>
              )}
            </Form>
            <DialogFooter>
              <Button type="default" onClick={handleCancel} className="mr-2">
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleOk}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Confirm
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
