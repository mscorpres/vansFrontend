import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import { CheckCircle, FileCheck, FilePlus, FileText } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const POLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink to={"/create-po"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            <FilePlus className="h-4 w-4 mr-2" />
              Create PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/manage-po"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            <FileText className="h-4 w-4 mr-2" />
              Manage PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/completed-po"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            <CheckCircle className="h-4 w-4 mr-2" />
              Completed PO
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/approve-po"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            <FileCheck className="h-4 w-4 mr-2" />
              Approve PO
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">{props.children}</div>
    </div>
  );
};

export default POLayout;
