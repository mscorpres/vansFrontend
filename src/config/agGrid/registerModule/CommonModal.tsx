import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Refresh } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button, Typography } from "@mui/material";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";

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
        className="min-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Typography variant="h6">Remove Entry</Typography>
        <Typography>{description}</Typography>

        <DialogFooter>
          <Button
            variant="outlined"
            type="default"
            onClick={handleCancel}
            className="mr-2"
            startIcon={<KeyboardBackspaceIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            type="primary"
            onClick={handleOk}
            style={{
              marginLeft: "10px",
              backgroundColor: "#d32f2f ",
              hover: "#e53935",
            }}
            // className="bg-teal-500 hover:bg-teal-600"
            startIcon={<DoneSharpIcon />}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
