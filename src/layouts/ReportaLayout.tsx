import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const ReportaLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center h-[50px]">
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r1"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R1
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              Box Stock Report (All)
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r2"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R2
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              PO Report
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r3"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R3
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              ALL Inward Report
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r4"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R4
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              All Item Closing Stock
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r5"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R5
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              Datewise All Item Closing Stock
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r6"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R6
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              Box Rate Report
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r7"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R7
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              Sales Order Report
            </span>
          </li>

          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r8"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R8
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              All Outward Report
            </span>
          </li>
          <li className="h-[50px] relative group/item">
            <NavLink
              to={"/inventory/report/r9"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              R9
            </NavLink>
            <span className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 hidden group-hover/item:block bg-yellow-300 text-black text-xs rounded py-1 px-2 z-20 whitespace-nowrap">
              Aging report
            </span>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto">
        {props.children}
      </div>
    </div>
  );
};

export default ReportaLayout;