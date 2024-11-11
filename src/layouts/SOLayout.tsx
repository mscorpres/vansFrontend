import { navlinkActiveStyle, navLinkStyle } from "@/constants/themeContants";
import React from "react";
import { NavLink } from "react-router-dom";

const SOLayout = (props: { children: React.ReactNode }) => {
  return (
    <div className="">
      <div className="w-full bg-white tab h-[50px] shadow z-10 border-b border-slate-300">
        <ul className="group flex items-center  h-[50px] ">
          <li className="h-[50px]">
            <NavLink to={"/sales/order/create"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            Create Sales Order
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/sales/order/register"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            Sales Order Register
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/sales/order/shipment"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            Sales Order Shipment
            </NavLink>
          </li>
          <li className="h-[50px]">
            <NavLink to={"/sales/order/invoice"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
            Invoice Register
            </NavLink>
          </li>
          {/* <li className="h-[50px]">
            <NavLink to={"/sales/order/allocated"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
              Allocated Invoice
            </NavLink>
          </li>*/}
          <li className="h-[50px]">
            <NavLink to={"/sales/order/e-transaction-register"} className={({ isActive }) => `${navLinkStyle} ${isActive && navlinkActiveStyle}`}>
              E Transaction Register
            </NavLink>
          </li> 
        </ul>
      </div>
      <div className="h-[calc(100vh-100px)] bg-transparent overflow-y-auto ">{props.children}</div>
    </div>
  );
};

export default SOLayout;
