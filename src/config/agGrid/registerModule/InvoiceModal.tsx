import { Button, Form, Input } from "antd";
import { FormInstance } from "antd/lib/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"; // Ensure this path is correct

interface InvoiceModalProps {
  isDialogVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  heading: string;
  description: string;
  form: FormInstance;
  loading?: boolean;
}

export function InvoiceModal({
  isDialogVisible,
  handleOk,
  handleCancel,
  heading,
  description,
  form,
  loading,
}: InvoiceModalProps) {
  return (
    <Dialog open={isDialogVisible} onOpenChange={handleCancel}>
      <DialogContent
        className="min-w-[600px]"
        onInteractOutside={(e: any) => e.preventDefault()}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <img src="/loader.gif" alt="Loading..." className="loading-image" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{heading}</DialogTitle>
            </DialogHeader>
            <Form form={form} layout="vertical">
              <p className="pb-5 text-[18px]">{description}</p>

              <Form.Item name="boxes" label="No of boxes">
                <Input.TextArea
                  rows={4}
                  placeholder="Enter no of boxes here"
                  style={{ height: 50, resize: "none" }}
                />
              </Form.Item>

              <Form.Item name="remark" label="Remark">
                <Input.TextArea
                  rows={4}
                  placeholder="Enter remarks here"
                  style={{ height: 50, resize: "none" }}
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
