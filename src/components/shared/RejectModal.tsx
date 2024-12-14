import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const RejectModal: React.FC<Props> = ({
  open,
  onClose,
  onOkay,
  setRejectText,
}) => {
  // State to track the input value
  const [rejectInput, setRejectInput] = useState("");

  // Check if the input matches 'reject' (case-insensitive)
  const isRejectInputValid = rejectInput.trim().toLowerCase() === "reject";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-600">
            Are you sure you want to reject this entry?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[20px] mt-[20px]">
          <div>
            <Label className={LableStyle}>
              Write <span className="font-[600] text-red-800">reject</span>{" "}
              inside input box
            </Label>
            <Input
              className={InputStyle}
              value={rejectInput}
              onChange={(e) => setRejectInput(e.target.value)}
            />
          </div>
          <div>
            <Label className={LableStyle}>Remark</Label>
            <Textarea
              onChange={(e) => setRejectText(e.target.value)}
              className={InputStyle}
            />
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button
            onClick={() => onClose(false)}
            variant={"outline"}
            className="shadow-slate-300"
          >
            No
          </Button>
          <Button
            className={"bg-red-700 hover:bg-red-600"}
            onClick={onOkay}
            disabled={!isRejectInputValid} // Disable the button if input is not "reject"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RejectModal;
