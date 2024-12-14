import { Props } from "@/types/salesmodule/salesShipmentTypes";
import React, { useState } from "react";
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
import { cancelFetchedPO } from "@/features/client/clientSlice";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import FullPageLoading from "@/components/shared/FullPageLoading";
import { Button } from "@mui/material";

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
  remarkDescription,
  setRemarkDescription,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { managePoList, loading } = useSelector(
    (state: RootState) => state.client
  );

  // Track the value of the cancel confirmation input
  const [cancelInput, setCancelInput] = useState("");

  // Check if the input value is 'cancel'
  const isCancelInputValid = cancelInput.trim().toLowerCase() === "cancel";

  const handleCancelPO = () => {
    setCancel(false);
    dispatch(
      cancelFetchedPO({
        poid: cancel.po_transaction,
        remark: remarkDescription,
      })
    ).then((response: any) => {
      if (response?.payload?.data?.success) {
        toast({
          title: response?.payload?.data?.message,
          className: "bg-green-600 text-white items-center",
        });
        setCancel(false);
        setShowConfirmation(false);
        setRemarkDescription("");
      } else {
        toast({
          title: response?.payload?.data?.message,
          className: "bg-red-600 text-white items-center",
        });
      }
    });
  };

  return (
    <Dialog open={cancel} onOpenChange={setCancel}>
      {loading && <FullPageLoading />}
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
            <Input
              className={InputStyle}
              value={cancelInput}
              onChange={(e) => setCancelInput(e.target.value)}
            />
          </div>
          <div>
            <Label className={LableStyle}>Remark</Label>
            <Textarea
              className={InputStyle}
              value={remarkDescription}
              onChange={(e) => setRemarkDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-[10px] justify-end mt-[10px]">
          <Button
            variant="outlined"
            onClick={() => setCancel(false)}
            className="shadow-slate-300"
          >
            No
          </Button>
          <Button
            variant="contained"
            onClick={handleCancelPO}
            disabled={!isCancelInputValid} // Disable the button if the input is not "cancel"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POCancel;
