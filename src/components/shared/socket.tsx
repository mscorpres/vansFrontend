import { io } from "socket.io-client";
import { getSocketLink } from "@/config/imsEndpoints";

const userToken = JSON.parse(localStorage.getItem("loggedInUser"))?.token;
const companyBranch = JSON.parse(
  localStorage.getItem("otherData")
)?.company_branch;

const socket = io(getSocketLink(), {
  extraHeaders: {
    token: userToken,
  },
  auth: {
    token: userToken,
    companyBranch: companyBranch,
  },
  transports: ["websocket"],
});

export default socket; // Default export of the socket instance
