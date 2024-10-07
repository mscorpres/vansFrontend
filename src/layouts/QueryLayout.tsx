import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const QueryLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink
              to={"/query/q1"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Q1
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/query/q2"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Q2
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink
              to={"/query/q3"}
              className={({ isActive }) =>
                `${navLinkStyle} ${isActive && navlinkActiveStyle}`
              }
            >
              Q3
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

export default QueryLayout;
