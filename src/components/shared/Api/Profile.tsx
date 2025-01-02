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
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEdit, FaKey, FaShieldAlt } from "react-icons/fa";
import SetPassword from "@/components/shared/SetPassword";

const StyledCard = styled(Card)(() => ({
  maxWidth: 800,
  margin: "auto",
  marginTop: 20,
  padding: 20,
}));

const ProfileComponent = () => {
const loading = false;
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [profileDataLocal, setProfileDataLocal] = useState({
    userName: "",
    email: "",
    phone: "",
    is2faActive: false,
  }); // Local state for profile editing
  const [twoFAEnabled] = useState(profileDataLocal?.is2faActive || false);
  const [showAlert, setShowAlert] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    // Retrieve loggedInUser from local storage
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      setProfileDataLocal(user);
    }
  }, []);
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
  const handleProfileChange = (e: any) => {
    setProfileDataLocal({
      ...profileDataLocal,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Verification Email
  const handleVerificationEmail = () => {
    setShowAlert({
      show: true,
      message: "Verification email sent!",
      severity: "success",
    });
  };

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
        {loading ? (
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
                  {profileDataLocal?.userName}
                </Typography>
                <Typography color="textSecondary">{profileDataLocal?.email}</Typography>
                <Typography color="textSecondary">{profileDataLocal?.phone}</Typography>
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

      {/* Edit Profile Dialog */}
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={profileDataLocal?.userName}
            onChange={handleProfileChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={profileDataLocal?.email}
            onChange={handleProfileChange}
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            name="phone"
            value={profileDataLocal?.phone}
            onChange={handleProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)}>Cancel</Button>
          <Button onClick={() => {}} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <SetPassword open={openChangePassword} onClose={()=>setOpenChangePassword(false)} />
    </Box>
  );
};

export default ProfileComponent;
