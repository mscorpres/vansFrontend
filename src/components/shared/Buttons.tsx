import { Refresh, Save, Send } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadIcon from "@mui/icons-material/Upload";
import CheckIcon from "@mui/icons-material/Check";
export const Back = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<KeyboardBackspaceIcon />}
      variant="outlined"
      onClick={onClick}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
    >
      Back
    </Button>
  );
};
export const Reset = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<Refresh />}
      variant="outlined"
      onClick={onClick}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
    >
      Reset
    </Button>
  );
};
export const Cancel = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      //   startIcon={<Refresh />}
      variant="outlined"
      onClick={onClick}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
    >
      Cancel
    </Button>
  );
};
export const Submit = ({ text, onClick, disabled }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<Send />}
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
    >
      {text ?? "Submit"}
    </Button>
  );
};
export const Confirm = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<CheckIcon />}
      variant="contained"
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
    >
      {text ?? "Confirm"}
    </Button>
  );
};
export const Upload = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1 }}
      startIcon={<UploadIcon />}
      variant="contained"
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
    >
      {text ?? "Upload"}
    </Button>
  );
};
export const AttachImage = ({ text, onClick }) => {
  return (
    <Button
      sx={{ ml: 1, width: "250px" }}
      startIcon={<AttachFileIcon />}
      variant="outlined"
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
    >
      {text}
    </Button>
  );
};
