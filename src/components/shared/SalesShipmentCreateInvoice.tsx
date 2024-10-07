import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputStyle, LableStyle, primartButtonStyle } from "@/constants/themeContants";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const SalesShipmentCreateInvoice: React.FC<Props> = ({ uiState }) => {

  
  const { createInvoice, setCreateInvoivce } = uiState;
  return (
    <Dialog open={createInvoice} onOpenChange={setCreateInvoivce}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-600">Are you sure you want to create this Invoice?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[20px] mt-[20px]">
          <div>
            <Label className={LableStyle}>No of Boxes</Label>
            <Input className={InputStyle} />
          </div>
          <div>
            <Label className={LableStyle}>Remark</Label>
            <Textarea className={InputStyle} />
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button onClick={() => setCreateInvoivce(false)} variant={"outline"} className="shadow-slate-300">
            No
          </Button>
          <Button className={primartButtonStyle}>Yes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesShipmentCreateInvoice;
