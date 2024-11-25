import React, { useEffect } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import {
  CircularProgress,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Stack,
} from "@mui/material";
import MuiTooltip from "../MuiTooltip";
import { useDispatch, useSelector } from "react-redux";
import { getNotification } from "@/features/client/branchSlice";
import { useToast } from "@/components/ui/use-toast";
const NotificationPnnel: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [notificationList, setNotificationList] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const { laoding } = useSelector((state: RootState) => state.branch);

  const { toast } = useToast();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const fetchNotification = async () => {
    dispatch(getNotification()).then((response) => {
      console.log("response", response);
      if (response.payload.success == true) {
        toast({
          title: response.payload.message,
          className: "bg-green-600 text-white items-center",
        });
        setNotificationList(response.payload.data);
      }
    });
  };
  console.log("notificationList---", notificationList);

  useEffect(() => {
    if (anchorEl) {
      console.log("anchorEl", anchorEl);

      fetchNotification();
    }
  }, [anchorEl]);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <MuiTooltip title="Notification" placement="bottom">
        <IconButton
          sx={{
            color: open ? "black" : "#525252",
            p: "12px",
            background: open ? "#e5e5e5" : "",
            border: "none",
            borderRadius: 0,
          }}
          aria-describedby={id}
          onClick={handleClick}
          aria-label="delete"
        >
          <NotificationsActiveIcon />{" "}
          {notificationList.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "0px", // Adjust position to move the badge slightly above the icon
                right: "-2px", // Adjust position to move the badge slightly to the right
                backgroundColor: "#ff0000", // Red background for the badge
                color: "white", // White text color for the number
                borderRadius: "50%",
                padding: "2px 6px", // Size of the badge
                fontSize: "10px", // Font size of the count
                fontWeight: "bold", // Bold font weight
              }}
            >
              {notificationList.length}
            </div>
          )}
        </IconButton>
      </MuiTooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            border: "none", // Remove border
            borderTopRightRadius: 0, // Remove border radius
            boxShadow: 2,
            maxHeight: "500px",
          },
        }}
      >
        <div className="w-[300px] max-w-[290px] bg-neutral-200 p-[10px]">
          <div className="min-h-[20px] ">
            <Typography sx={{ p: 2 }}>Notification</Typography>
          </div>
          <div className="bg-white w-full max-w-[290px] rounded flex flex-col">
            <MenuList className="w-full">
              {notificationList.map((item: any, index: number) => (
                <MenuItem key={index} className="w-full p-[5px]">
                  <div className="flex flex-col p-[10px]">
                    <div className="font-bold">{item.title}</div>

                    {/* Wrap the message to ensure it doesn't overflow */}
                    <div className="text-[12px] overflow-hidden overflow-ellipsis whitespace-normal break-words">
                      {item?.message}
                    </div>

                    {/* Additional content */}
                    <div className="flex items-center gap-[10px]">
                      <div className="font-bold">{item?.name}</div>
                    </div>
                    <div className="flex items-center gap-[10px] justify-end">
                      <div className="font-tiny text-[9px] text-slate-600">
                        {item?.created_at}
                      </div>
                    </div>
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </div>
          <div className="bg-white h-[80px] w-full max-w-[290px] rounded flex items-center justify-center">
            {laoding && <CircularProgress size={20} />}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default NotificationPnnel;
