import React from "react";
import { Dispatch, SetStateAction } from "react";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { Button, Typography } from "@mui/material";
interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  goBack: Dispatch<SetStateAction<boolean>>;
}
const GoBackConfermationModel: React.FC<Props> = ({
  open,
  setOpen,
  goBack,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen} className="w-1/2">
      <AlertDialogContent className="w-1/2">
        <Typography id="transition-modal-title" variant="h5" component="h2">
          Reset Field
        </Typography>
        <Typography
          id="transition-modal-description"
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Are you absolutely sure you want to go to the previous page and reset
          the form?
        </Typography>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="contained"
            onClick={() => {
              goBack(false), setOpen(false);
            }}
          >
            Reset
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default GoBackConfermationModel;
