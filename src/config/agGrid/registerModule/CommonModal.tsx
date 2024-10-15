import { Button } from "antd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CommonModalProps {
  isDialogVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  title: string;
  description: string;
}

export function CommonModal({
  isDialogVisible,
  handleOk,
  handleCancel,
  title,
  description,
}: CommonModalProps) {
  return (
    <Dialog open={isDialogVisible} onOpenChange={handleCancel}>
      <DialogContent
        className="min-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p>{description}</p>
        </div>
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
      </DialogContent>
    </Dialog>
  );
}
