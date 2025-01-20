import React, { useState } from "react";

import reset from "@/assets/reset.png";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { styled } from "@mui/system";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
function ChangePassword() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleResetPassword = (data) => {
    // Here, implement your password reset logic (e.g., API call)
    setSnackbarMessage("Password reset successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  const handleError = () => {
    setSnackbarMessage("Please fill out all fields correctly.");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="h-[calc(100vh-50px)] w-full flex items-center justify-center">
      <div className="h-[calc(100vh-50px)]   w-full grid grid-cols-2  ">
        <div className="w-full h-full  ">
          <img
            src={reset}
            // alt="project under developent"
            className="h-[90%] w-[120%] justify-self-center opacity-80"
          />
        </div>

        <div className="h-[600px]   flex items-center justify-center w-full ">
          <Box
            // display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
            sx={{ backgroundColor: "#f4f4f4", marginRight: "80px" }}
          >
            <Typography variant="h3" component="h2" gutterBottom>
              Reset Password
            </Typography>{" "}
            <Typography variant="body2" color="textSecondary" paragraph>
              Enter your new password and confirm it to reset your password.
            </Typography>
            <Card sx={{ width: 500, padding: 3 }}>
              <CardContent>
                <form onSubmit={handleSubmit(handleResetPassword, handleError)}>
                  {/* <div className="grid grid-cols-2 gap-4"> */}
                  <TextField
                    label="New Password"
                    type={showPassword ? "text" : "password"} // Toggle password visibility
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={Boolean(errors.password)}
                    helperText={errors.password && "Password is required"}
                    {...control.register("password", { required: true })}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          position="end"
                          onClick={togglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />

                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required
                    error={Boolean(errors.confirmPassword)}
                    helperText={
                      errors.confirmPassword && "Passwords must match"
                    }
                    {...control.register("confirmPassword", {
                      required: true,
                      validate: (value) =>
                        value === control.getValues("password"),
                    })}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          position="end"
                          onClick={toggleConfirmPasswordVisibility}
                          edge="end"
                          aria-label="toggle confirm password visibility"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      ),
                    }}
                  />

                  {/* </div> */}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Reset Password
                  </Button>
                </form>
              </CardContent>
            </Card>
            {/* Snackbar for feedback */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity={snackbarSeverity}
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </div>
      </div>{" "}
      <div className="absolute bottom-0 left-0 flex items-center justify-center w-full text-center  py-[10px]">
        <Typography fontSize={13}>
          &copy; 2019 - {new Date().getFullYear()}. All Rights Reserved
          <br />
          Performance & security by{" "}
          <Link href="https://mscorpres.com/" target="blank">
            MsCorpres Automation Pvt. Ltd.
          </Link>
        </Typography>
      </div>
    </div>
  );
}

export default ChangePassword;
