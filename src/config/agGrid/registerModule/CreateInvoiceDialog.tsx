import { Button, DatePicker, Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Ensure this path is correct
import moment from "moment";
import { InputStyle } from "@/constants/themeContants";

interface CreateInvoiceDialogProps {
  isDialogVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  row: {
    req_id: string;
  };
  form: FormInstance;
  setDate: any;
  loading?: boolean;
}

export function CreateInvoiceDialog({
  isDialogVisible,
  handleOk,
  handleCancel,
  row,
  form,
  setDate,
  loading,
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={isDialogVisible} onOpenChange={handleCancel}>
      <DialogContent
        className="min-w-[600px]"
        onInteractOutside={(e:any) => e.preventDefault()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <img src="/loader.gif" alt="Loading..." className="loading-image" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <Form form={form} layout="vertical">
              <p className="pb-5 text-[18px]">
                Are you sure you want to create an invoice for SO {row.req_id}?
              </p>

              <Form.Item name="remark" label="Remark">
                <Input.TextArea
                  rows={4}
                  style={{ height: 120, resize: "none" }}
                  className={InputStyle}
                />
              </Form.Item>
            </Form>
            <DialogFooter>
              <Button type="default" onClick={handleCancel} className="mr-2">
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleOk}
                className="bg-teal-500 hover:bg-teal-600 text-white"
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
