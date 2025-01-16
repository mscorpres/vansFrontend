import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  Alert,
  Grid,
  IconButton,
  Skeleton,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEdit, FaKey, FaShieldAlt } from "react-icons/fa";
import SetPassword from "@/components/shared/SetPassword";
import { toast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  getOtpForProfile,
  updateProfileName,
  userDetailsForProfile,
  verifyOtpForProfileEmail,
} from "@/features/client/clientSlice";

const StyledCard = styled(Card)(() => ({
  maxWidth: 800,
  margin: "auto",
  marginTop: 20,
  padding: 20,
}));

const ProfileComponent = () => {
  const loading = false;
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);
  const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerify, setEmailVerify] = useState(false);
  const [profileDataLocal, setProfileDataLocal] = useState({
    userName: "",
    email: "",
    phone: "",
    otp: "",
    is2faActive: false,
  }); // Local state for profile editing
  const [profileDataogLocal, setProfileDataogLocal] = useState({
    userName: "",
    email: "",
    phone: "",
    otp: "",
    is2faActive: false,
  }); // Local state for profile editing
  const [twoFAEnabled] = useState(profileDataLocal?.is2faActive || false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });
  const dispatch = useDispatch();
  const { editProfile, loading: editProfileLoading } = useSelector(
    (state) => state.client
  );
  useEffect(() => {
    getTheLatestProfile();
  }, []);

  useEffect(() => {
    console.log("profileDataogLocal has been updated:", profileDataogLocal);
    setProfileDataLocal(profileDataogLocal);
  }, [profileDataogLocal]);

  // Handle Edit Profile submission
  // const handleEditProfile = async () => {
  //   try {
  //     await dispatch(updateProfile(profileDataLocal));
  //     setShowAlert({
  //       show: true,
  //       message: "Profile updated successfully!",
  //       severity: "success",
  //     });
  //     setOpenEditProfile(false);
  //   } catch (error) {
  //     setShowAlert({
  //       show: true,
  //       message: "Error updating profile!",
  //       severity: "error",
  //     });
  //   }
  // };

  // Handle 2FA toggle
  // const handleTwoFA = async () => {
  //   try {
  //     await dispatch(toggle2FA(!twoFAEnabled));
  //     setTwoFAEnabled(!twoFAEnabled);
  //     setShowAlert({
  //       show: true,
  //       message: `Two-factor authentication ${!twoFAEnabled ? "enabled" : "disabled"}!`,
  //       severity: "success",
  //     });
  //   } catch (error) {
  //     setShowAlert({
  //       show: true,
  //       message: "Error updating 2FA status!",
  //       severity: "error",
  //     });
  //   }
  // };

  // Handle Profile Data Changes
  const handleChangeinOTP = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move focus to next input
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleProfileChange = (e: any) => {
    setProfileDataLocal({
      ...profileDataLocal,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    if (otp) {
      setProfileDataLocal({
        ...profileDataLocal,
        otp: otp,
      });
    }
  }, [otp]);

  // Handle Verification Email
  const handleVerificationEmail = () => {
    setShowAlert({
      show: true,
      message: "Verification email sent!",
      severity: "success",
    });
  };
  const getOtpNumber = async () => {
    setOpenVerify(true);
    sendOtp();
  };
  const getOtpEmail = async () => {
    setOpenVerifyEmail(true);
    let payload = { email: profileDataLocal.email };

    sendOtp(payload);
  };
  const updateVerifyEmail = async () => {
    let payload = {
      otp: profileDataLocal.otp.join(""),
      emailId: profileDataLocal.email,
    };

    const response = await dispatch(verifyOtpForProfileEmail(payload));

    if (response?.payload.success == true) {
      setOpenVerifyEmail(false);
      setProfileDataLocal({
        ...profileDataLocal,
        otp: "", // Correctly sets the `otp` field
      });
      toast({
        title: "Email updated successfully!",
        className: "bg-green-600 text-white items-center relative z-50",
      });
    } else {
      toast({
        title: response?.data?.message,
        className: "bg-red-600 text-white items-center relative z-50",
      });
    }
  };
  const sendOtp = async (payload) => {
    const response = await dispatch(getOtpForProfile(payload));
    console.log("response", response);

    if (response?.payload?.data?.success == true) {
      toast({
        title: response?.payload?.data?.message,
        className: "bg-green-600 text-white items-center relative z-50",
      });
    } else {
      toast({
        title: response?.data?.message,
        className: "bg-red-600 text-white items-center relative z-50",
      });
    }
  };
  const updateName = async () => {
    let payload = { fullname: profileDataLocal.userName };
    const response = await dispatch(updateProfileName(payload));
    console.log("response", response);

    if (response?.payload?.success == true) {
      toast({
        title: response?.payload?.message,
        className: "bg-green-600 text-white items-center relative z-50",
      });
    } else {
      toast({
        title: response?.payload?.message,
        className: "bg-red-600 text-white items-center relative z-50",
      });
    }
    getTheLatestProfile();
  };
  const getTheLatestProfile = async () => {
    console.log("here");

    const response = await dispatch(userDetailsForProfile());
    console.log("response", response);
    if (response?.payload?.data?.status == "success") {
      let d1 = response.payload.data;
      console.log("d1", d1);

      setProfileDataogLocal({
        userName: d1.data.name,
        email: d1.data.email,
        phone: d1.data.phone,
      });
    }
  };
  useEffect(() => {
    // console.log("profileDataLocal", profileDataLocal);
    // console.log("profileDataogLocal", profileDataogLocal);
    if (profileDataLocal.phone == profileDataogLocal.phone) {
      setPhoneVerify(true);
    } else {
      setPhoneVerify(false);
    }
    if (profileDataLocal.email == profileDataogLocal.email) {
      setEmailVerify(true);
    } else {
      setEmailVerify(false);
    }
  }, [profileDataLocal]);

  return (
    <Box sx={{ p: 3 }}>
      {showAlert.show && (
        <Alert
          // severity={showAlert.severity}
          onClose={() => setShowAlert({ ...showAlert, show: false })}
          sx={{ mb: 2 }}
        >
          {showAlert.message}
        </Alert>
      )}

      <StyledCard>
        {loading || editProfileLoading ? (
          <div>
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
            <Skeleton variant="rectangular" width={210} height={60} />
            <Skeleton variant="rounded" width={210} height={60} />
          </div>
        ) : (
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar
                  src={"https://www.w3schools.com/w3images/avatar2.png"}
                  alt={"https://www.w3schools.com/w3images/avatar2.png"}
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h5" gutterBottom>
                  {profileDataogLocal?.userName}
                </Typography>
                <Typography color="textSecondary">
                  {profileDataogLocal?.email}
                </Typography>
                <Typography color="textSecondary">
                  {profileDataogLocal?.phone}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton
                  onClick={() => setOpenEditProfile(true)}
                  color="primary"
                >
                  <FaEdit />
                </IconButton>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              {/* <Button
                variant="outlined"
                startIcon={<FaKey />}
                onClick={() => setOpenChangePassword(true)}
                sx={{ mr: 2 }}
              >
                Change Password
              </Button> */}

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaShieldAlt style={{ marginRight: 8 }} />
                    <span>Two-Factor Authentication</span>
                  </Box>
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    checked={twoFAEnabled}
                    onChange={() => {}}
                    color="primary"
                  />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {twoFAEnabled ? "Enabled" : "Disabled"}
                  </Typography>
                </Box>
                {twoFAEnabled && (
                  <Button
                    variant="contained"
                    onClick={handleVerificationEmail}
                    sx={{ mt: 2 }}
                  >
                    Send Verification Email
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        )}
      </StyledCard>
      <StyledCard
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "none", // Remove the border
          boxShadow: "none", // Optional: Remove any box shadow if there's one
        }}
      >
        <div className="flex">
          <Button
            variant="outlined"
            startIcon={<FaKey />}
            onClick={() => setOpenChangePassword(true)}
            sx={{ mr: 2 }}
          >
            Change Password
          </Button>
        </div>
      </StyledCard>

      {/* Verify OTP  Phone*/}
      <Dialog
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        sx={{ zIndex: 10 }}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="userName"
            fullWidth
            name="userName"
            value={profileDataLocal?.userName}
            onChange={handleProfileChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            name="phone"
            value={profileDataLocal?.phone}
            onChange={handleProfileChange}
            inputProps={{ "aria-label": "Enter Phone Number" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    // disabled={phoneVerify}
                    disabled
                    // onClick={() => {
                    //   setOpenVerify(true);
                    // }}
                    onClick={() => {
                      getOtpNumber();
                    }}
                  >
                    Verify
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={profileDataLocal?.email}
            onChange={handleProfileChange}
            placeholder="Search Google Maps"
            inputProps={{ "aria-label": "Enter Email" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    variant="text"
                    // disabled={emailVerify}
                    onClick={() => {
                      getOtpEmail();
                    }}
                  >
                    Verify
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button
            disabled={editProfileLoading}
            onClick={() => {
              updateName();
            }}
            variant="contained"
          >
            {editProfileLoading ? "Please wait..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openVerify}
        onClose={() => setOpenVerify(false)}
        sx={{ zIndex: 10 }}
      >
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Phone"
            fullWidth
            name="phone"
            value={profileDataLocal?.phone}
            onChange={handleProfileChange}
          />

          <TextField
            margin="dense"
            label="OTP"
            fullWidth
            name="otp"
            value={profileDataLocal?.otp}
            onChange={handleProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerify(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openVerifyEmail}
        onClose={() => setOpenVerifyEmail(false)}
        sx={{ zIndex: 10 }}
      >
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          {/* {editProfileLoading && <FullPageLoading />} */}
          {/* {editProfileLoading && <CircularProgress />} */}
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            fullWidth
            name="email"
            value={profileDataLocal?.email}
            onChange={handleProfileChange}
          />
          {/* <TextField
            margin="dense"
            label="OTP"
            fullWidth
            name="otp"
            value={profileDataLocal?.otp}
            onChange={handleProfileChange}
          />{" "} */}
          <Box
            display="flex"
            justifyContent="center"
            gap={2}
            sx={{ my: "10px" }}
          >
            {otp.map((digit, index) => (
              <TextField
                name="otp"
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChangeinOTP(e.target.value, index)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center", fontSize: "15px" },
                }}
                variant="outlined"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerifyEmail(false)}>Cancel</Button>
          <Button
            loading={editProfileLoading}
            variant="contained"
            loadingPosition="end"
            onClick={() => {
              updateVerifyEmail();
            }}
            disabled={editProfileLoading}
          >
            {editProfileLoading ? "Please wait..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <SetPassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </Box>
  );
};

export default ProfileComponent;
