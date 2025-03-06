import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaQuestionCircle } from "react-icons/fa"; // For the question mark icon

interface ConfirmationModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  onOkay: () => void;
  title: string;
  description: string;
  submitText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ open, onClose, onOkay, title, description, submitText = "Yes, Cancel", cancelText = "No" }) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose(false)}>
      <DialogContent
        onInteractOutside={(e: any) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px] rounded-lg"
      >
        {/* Main Content */}
        <div className="flex gap-4 p-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <FaQuestionCircle className="text-blue-400 text-4xl" />
          </div>
          {/* Text Content */}
          <div className="flex-1">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-gray-800">{title}</DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">
                <span className="font-bold">Note:</span> {description}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Button Section */}
        <div className="flex items-center gap-[10px] justify-end p-4 bg-gray-100 rounded-b-lg">
          <Button onClick={() => onClose(false)} variant="outline" className="border-gray-400 text-gray-700 hover:bg-gray-200">
            {cancelText}
          </Button>
          <Button onClick={() => onOkay()} className="bg-gray-500 hover:bg-gray-600 text-white">
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
