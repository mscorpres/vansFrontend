import { Box, Drawer, IconButton } from "@mui/material";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Typography } from "antd";
import React from "react";

export const MuiDrawer = ({ open, setOpen, title, content, width }) => {
  return (
    <Drawer
      anchor="right" // "left", "right", "top", or "bottom"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          width: width ?? 1300, // Set the drawer width
          transition: "transform 5s ease-in-out, opacity 5s ease", // Slower transition for both
          transform: open ? "translateX(0)" : "translateX(-100%)", // Slide effect
          opacity: open ? 1 : 0, // Fade effect
        },
      }}
      onClose={() => setOpen(false)} // Close when clicking outside or pressing ESC
    >
      {" "}
      <Box sx={{ width: "100% " }} role="presentation">
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            width: "100%",

            // backgroundColor: "#1976d2",
            color: "white",
          }}
        >
          <IconButton onClick={setOpen} color="inherit">
            <ChevronLeftIcon color="black" size={"1rem"} />
          </IconButton>

          <Typography.Title style={{ marginLeft: "20px" }} level={4}>
            {title}
          </Typography.Title>
          {/* Close Button */}
        </Box>
        {content}
      </Box>
    </Drawer>
  );
};
