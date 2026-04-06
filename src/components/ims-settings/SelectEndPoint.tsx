import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useEffect, useMemo, useState } from "react";
import { LS_BASE_URLS, LS_CURRENT_URL } from "@/config/imsEndpoints";

const envDefault =
  (import.meta.env.VITE_REACT_APP_API_BASE_URL as string) || "";

const SelectEndPoint: React.FC = () => {
  const [urls, setUrls] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem(LS_BASE_URLS) || "[]"),
  );
  const [currentUrl, setCurrentUrl] = useState<string>(
    () => localStorage.getItem(LS_CURRENT_URL) || envDefault,
  );
  const [open, setOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      setUrls(JSON.parse(localStorage.getItem(LS_BASE_URLS) || "[]"));
      setCurrentUrl(localStorage.getItem(LS_CURRENT_URL) || envDefault);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSaveUrl = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newUrl.trim()) return;

    const updatedUrls = Array.from(new Set([...urls, newUrl.trim()]));
    localStorage.setItem(LS_BASE_URLS, JSON.stringify(updatedUrls));
    localStorage.setItem(LS_CURRENT_URL, newUrl.trim());
    setUrls(updatedUrls);
    setCurrentUrl(newUrl.trim());
    setNewUrl("");
    handleClose();
    window.location.reload();
  };

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedUrl = event.target.value;
    localStorage.setItem(LS_CURRENT_URL, selectedUrl);
    setCurrentUrl(selectedUrl);
  };

  const options = useMemo(
    () =>
      Array.from(new Set([...(envDefault ? [envDefault] : []), ...urls])),
    [urls],
  );

  const selectValue = options.includes(currentUrl)
    ? currentUrl
    : (options[0] ?? "");

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ component: "form", onSubmit: handleSaveUrl }}
      >
        <DialogTitle>Enter Base URL</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your backend base URL to save and use it across the
            application.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="url"
            name="url"
            label="Base URL"
            type="url"
            fullWidth
            variant="standard"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>

      <div className="flex flex-col gap-2 w-full min-w-0">
        <div className="flex items-center gap-2 w-full min-w-0">
          <FormControl fullWidth size="small" sx={{ minWidth: 0 }}>
            <Select
              displayEmpty
              value={selectValue}
              onChange={handleChange}
              renderValue={(v) => v || "—"}
            >
              {options.map((url) => (
                <MenuItem key={url} value={url}>
                  {url}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleClickOpen} aria-label="Add API base URL">
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default SelectEndPoint;
