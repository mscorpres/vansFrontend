import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const MasterProductLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink to={"/master/product/fg"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
              FG Products
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/master/product/sfg"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
              SFG Products
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">{props.children}</div>
    </div>
  );
};

export default MasterProductLayout;
