import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  onOkay: () => void;
  title: string;
  description: string;
  submitText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onOkay,
  title,
  description,
  submitText = "Yes",
  cancelText = "No",
}) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-slate-600">{title}</DialogTitle>
          <DialogDescription className="mt-2 text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button onClick={() => onClose(false)} variant={"outline"}>
            {cancelText}
          </Button>
          <Button onClick={onOkay} className="bg-green-600 text-white">
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
