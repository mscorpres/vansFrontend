import React, { useState } from "react";

import FP2 from "@/assets/FP2.png";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { styled } from "@mui/system";
const ForgetPasswordNew = () => {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    // Validate email
    if (!email) {
      setSnackbarMessage("Please enter an email address.");
      setOpenSnackbar(true);
      return;
    }

    // Handle password reset logic here (e.g., API call)
    console.log("Password reset request for:", email);
    setSnackbarMessage("Password reset instructions sent to your email!");
    setOpenSnackbar(true);
  };

  return (
    <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
      <div className="h-[calc(100vh-50px)]   w-full grid grid-cols-2 bg-[url(@/assets/FP2.png)] bg-size-cover bg-cover w-100 h-100 ">
        <div className="w-full h-full  ">
          {/* <img
          src={FP2}
          // alt="project under developent"
          className="h-[70%] justify-self-center opacity-80"
        /> */}
        </div>

        <div className="h-[600px]   flex items-center justify-center w-full ">
          {/* <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "#f4f4f4" }}
        > */}
          <Card sx={{ maxWidth: 500, width: "100%", padding: 2, opacity: 1 }}>
            <CardContent>
              <div className="flex items-center justify-center mb-4 ">
                <div className="flex items-center justify-center w-25 h-25 bg-[#BAD3FD] p-2  color-black rounded-full ">
                  <KeyIcon className="text-black" fontSize="medium" />
                </div>
              </div>
              <Typography variant="h4" component="h2" gutterBottom>
                Forgot Password
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Enter your email address to receive password reset instructions.
              </Typography>

              <TextField
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                sx={{ marginBottom: 2 }}
                required
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                sx={{ marginBottom: 2 }}
              >
                Send Reset Link
              </Button>
              <Button
                variant="link"
                // color="primary"
                fullWidth
                onClick={handleSubmit}
                startIcon={<KeyboardBackspaceIcon />}
              >
                Back to Log in
              </Button>
            </CardContent>
          </Card>

          {/* Snackbar for feedback */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            message={snackbarMessage}
          />
          {/* </Box> */}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordNew;
