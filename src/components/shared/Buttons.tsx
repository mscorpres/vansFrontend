import { Refresh,  Send } from "@mui/icons-material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Button } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadIcon from "@mui/icons-material/Upload";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Plus } from "lucide-react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
interface RegisterProps {
  text: string;
  disabled: any;
  onClick: () => void;
  variant?: "contained" | "outlined" | "text"; // You can adjust the possible values of 'variant' based on your use case
}
export const Back: React.FC<RegisterProps> = ({ onClick }) => {
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
export const Reset: React.FC<RegisterProps> = ({ onClick }) => {
  return (
    <Button
      sx={{ ml: 1, color: "red" }}
      startIcon={<Refresh />}
      variant="outlined"
      onClick={onClick}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px] text-red-500"
    >
      Reset
    </Button>
  );
};
export const Cancel: React.FC<RegisterProps> = ({ onClick }) => {
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
export const Submit: React.FC<RegisterProps> = ({
  text,
  onClick,
  disabled,
}) => {
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
export const Confirm: React.FC<RegisterProps> = ({ text, onClick }) => {
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
export const Upload: React.FC<RegisterProps> = ({ text, onClick }) => {
  return (
    <Button
      sx={{
        ml: 1,
        backgroundColor: "#217346",
        ":hover": { backgroundColor: "#2f8254" },
      }}
      startIcon={<UploadIcon />}
      variant="contained"
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px] "
    >
      {text ?? "Upload"}
    </Button>
  );
};
export const AttachImage: React.FC<RegisterProps> = ({ text, onClick }) => {
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
export const Search: React.FC<RegisterProps> = ({ onClick }) => {
  return (
    <Button
      sx={{ ml: 1, width: "250px" }}
      startIcon={<SearchIcon />}
      variant="contained"
      onClick={onClick}
      className="rounded-md shadow  shadow-slate-500 max-w-max px-[30px]"
    >
      Search
    </Button>
  );
};
export const Next: React.FC<RegisterProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      startIcon={<NavigateNextIcon />}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
      onClick={onClick}
    >
      Next
    </Button>
  );
};
export const Add: React.FC<RegisterProps> = ({ text, onClick, variant }) => {
  return (
    <Button
      variant={variant ?? "contained"}
      startIcon={<Plus />}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
export const Register: React.FC<RegisterProps> = ({
  text,
  onClick,
  variant,
}) => {
  return (
    <Button
      variant={variant ?? "contained"}
      startIcon={<SaveAsIcon />}
      className="rounded-md shadow shadow-slate-500 max-w-max px-[30px]"
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
