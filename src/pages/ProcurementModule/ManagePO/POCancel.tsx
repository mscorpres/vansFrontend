import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputStyle, LableStyle } from "@/constants/themeContants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { cancelFetchedPO } from "@/features/client/clientSlice";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { toast } from "@/components/ui/use-toast";
interface Props {
  cancel: boolean;
  setCancel: (value: boolean) => void;
  setShowConfirmation: (value: boolean) => void;
  showConfirmation: boolean;
}

const POCancel: React.FC<Props> = ({
  cancel,
  setCancel,
  setShowConfirmation,
  showConfirmation,
  // handleCancelPO,
  remarkDescription,
  setRemarkDescription,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleCancelPO = () => {
    dispatch(
      cancelFetchedPO({
        poid: cancel.po_transaction,
        remark: remarkDescription,
      })
    ).then((response: any) => {
      if (response?.payload?.status == "success") {
        setCancel(false);
      } else {
        toast({
          title: response?.error?.message,
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };
  return (
    <Dialog open={cancel} onOpenChange={setCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-600">
            Are you sure you want to cancel this Purchase Order?
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[20px] mt-[20px]">
          <div>
            <Label className={LableStyle}>
              Write <span className="font-[600] text-red-800">cancel</span>{" "}
              inside input box
            </Label>
            <Input className={InputStyle} />
          </div>
          <div>
            <Label className={LableStyle}>Remark</Label>
            <Textarea
              className={InputStyle}
              onChange={(e) => setRemarkDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button
            onClick={() => setCancel(false)}
            variant={"outline"}
            className="shadow-slate-300"
          >
            No
          </Button>
          <Button
            className={"bg-red-700 hover:bg-red-600"}
            onClick={handleCancelPO}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POCancel;
