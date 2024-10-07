import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const SalesShipmentCancel: React.FC<Props> = ({ uiState }) => {
  const { cancelShipment, setCancelShipment } = uiState;
  return (
    <Dialog open={cancelShipment} onOpenChange={setCancelShipment}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-600">Are you sure you want to cancel this Shipment?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[20px] mt-[20px]">
          <div>
            <Label className={LableStyle}>
              Write <span className="font-[600] text-red-800">cancel</span> iside input box
            </Label>
            <Input className={InputStyle} />
          </div>
          <div>
            <Label className={LableStyle}>Remark</Label>
            <Textarea className={InputStyle} />
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button onClick={() => setCancelShipment(false)} variant={"outline"} className="shadow-slate-300">
            No
          </Button>
          <Button className={"bg-red-700 hover:bg-red-600"}>Yes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesShipmentCancel;
