import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const ReportLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r1"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R1
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r2"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R2
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r3"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R3
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r4"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R4
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r5"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R5
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/inventory/r6"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R6
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">
        {props.children}
      </div>
    </div>
  );
};

export default ReportLayout;
