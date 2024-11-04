import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const InwardLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/inward"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Inward
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/boxMarkup"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Box Markup
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/childMarkup"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Child Markup
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/batchAllocation"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Batch Allocation
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/PickSlip"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Pick Slip
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/PickSlip/print"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Print Pick Slip
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/min/print"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Print MIN Label
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/warehouse/itemQr"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Item QR
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

export default InwardLayout;
