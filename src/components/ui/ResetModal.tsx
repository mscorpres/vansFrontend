import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Refresh } from "@mui/icons-material";
import { Cancel } from "../shared/Buttons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ResetModal({ open, setOpen, form, message, reset }) {
  //   const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleReset = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        width={500}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        disableEnforceFocus
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Reset Field
            </Typography>
            <Typography
              id="transition-modal-description"
              sx={{ mt: 2, color: "text.secondary" }}
            >
              Are you absolutely sure you want to reset the form?
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <Cancel onClick={handleClose}>Cancel</Cancel>

              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#d32f2f ",
                  hover: "#e53935",
                }}
                variant="contained"
                className=" shadow hover:#e53935 shadow-slate-500"
                onClick={message == "row" ? reset : handleReset}
                startIcon={<Refresh />}
              >
                Reset
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
