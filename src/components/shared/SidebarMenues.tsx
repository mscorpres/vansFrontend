import { ChevronRight, Star } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";

import { IoGrid } from "react-icons/io5";
// import { FaUserPen } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { PiListStarBold } from "react-icons/pi";
// import { FaCartShopping } from "react-icons/fa6";
// import { MdWarehouse } from "react-icons/md";
// import { SiNginxproxymanager } from "react-icons/si";
// import { MdOutlineDriveFileMoveRtl } from "react-icons/md";
// import { AiFillProduct } from "react-icons/ai";
// import { TbReportSearch } from "react-icons/tb";
// import { FaQuestionCircle } from "react-icons/fa";
// import { PiGridNineFill } from "react-icons/pi";
// import { FaClipboardList } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { Props } from "@/types/MainLayout";
import { CgArrowTopRight } from "react-icons/cg";
import CustomTooltip from "./CustomTooltip";
import {
  materialmenu,
  printMenu,
  useFullLinks,
  customerEnquiry,
  customerEnquiryClient,
} from "@/data/SidebarMenuData";
import { IoIosPrint } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "@/features/auth/FavoriteSlice";
const renderMenu = (menu: any, setSidemenu: any) => {
  // const [favoriteItems, setFavoriteItems] = useState<any>([]); // Track the selected item for favorites
  const favoriteItems = useSelector(
    (state: any) => state.favorites.favoriteItems
  );

  const dispatch = useDispatch();

  const handleToggleFavorite = (item: any) => {
    dispatch(toggleFavorite(item)); // Dispatch the action to toggle favorite
  };

  // const toggleFavorite = (item: any) => {
  //   // Check if the item is already in the list of favorites
  //   const isFavorited = favoriteItems.some((fav) => fav.name === item.name);

  //   if (isFavorited) {
  //     // Remove the item from the favorites list if it's already there
  //     setFavoriteItems(favoriteItems.filter((fav) => fav.name !== item.name));
  //   } else {
  //     // Add the item to the favorites list
  //     setFavoriteItems([...favoriteItems, item]);
  //   }
  // };

  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-[10px]">
        {menu.map((item: any, index: number) => (
          <li key={index}>
            {item.subMenu ? (
              <AccordionItem
                value={`${index + item.name}`}
                className="border-0"
              >
                <AccordionTrigger className="hover:no-underline hover:bg-cyan-800 p-[10px] rounded-md cursor-pointer">
                  <span className="flex gap-[10px] items-center">
                    {item.name}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="p-[10px] mt-[10px] border-l-2 border-yellow-600 bg-cyan-900 rounded">
                  {renderMenu(item.subMenu, setSidemenu)}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Link
                  onClick={() => setSidemenu(false)}
                  to={item.path}
                  className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md cursor-pointer flex items-center gap-[10px]"
                >
                  {item.name}{" "}
                  <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
                </Link>

                <CustomTooltip message="Add to favorite" side="right">
                  <div className="h-[30px] min-w-[30px] flex justify-center items-center hover:bg-white hover:text-cyan-600 transition-all cursor-pointer rounded-md">
                    {favoriteItems.some((fav) => fav.name === item.name) ? (
                      <FaStar
                        className="h-[16px] w-[16px]"
                        // onClick={() => toggleFavorite(item)}
                        onClick={() => handleToggleFavorite(item)}
                      />
                    ) : (
                      <Star
                        className="h-[16px] w-[16px]"
                        onClick={() => handleToggleFavorite(item)}
                      />
                    )}
                  </div>
                </CustomTooltip>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Accordion>
  );
};

const SidebarMenues: React.FC<Props> = ({ uiState }) => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  const { sheetOpen, setSheetOpen, modalRef } = uiState;

  // Check user type outside of JSX
  const isClient = userData?.type === "client";

  const nonClientMenu = (
    <>
      <li>
        <NavLink
          to="/"
          className="flex gap-[10px] items-center py-[10px] hover:bg-cyan-800 p-[10px] rounded-md"
        >
          <MdHome className="h-[20px] w-[20px]" />
          Dashboard
        </NavLink>
      </li>
      <li className="group">
        <div className="flex justify-between items-center py-[10px] hover:bg-cyan-800 p-[10px] group-hover:bg-cyan-800 rounded-md cursor-pointer">
          <span className="flex gap-[10px] items-center cursor-pointer">
            <IoGrid className="h-[20px] w-[20px]" />
            Material Management
          </span>
          <ChevronRight />
        </div>
        <div className="top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md right-[0] w-[0] opacity-0 overflow-hidden transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
          <div className="min-w-[400px]">
            <div className="p-[10px] h-[130px]">
              <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                <IoGrid className="h-[20px] w-[20px]" />
                Material Management
              </span>
              <a
                href="#"
                className="font-[350] text-[13px] mt-[10px] text-blue-200"
              >
                Explore material management
              </a>
            </div>
            <Separator className="bg-slate-200 text-slate-200" />
            <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px]">
              {renderMenu(materialmenu, setSheetOpen)}
            </ul>
          </div>
        </div>
      </li>{" "}
      <li className="group">
        <div
          className={
            "flex justify-between items-center py-[10px] hover:bg-cyan-800 p-[10px] group-hover:bg-cyan-800 rounded-md cursor-pointer"
          }
        >
          <span className="flex gap-[10px] items-center cursor-pointer">
            <IoIosPrint className="h-[20px] w-[20px]" />
            Generate Print
          </span>
          <ChevronRight />
        </div>
        <div className=" top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md  right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
          <div className="min-w-[400px]">
            <div className="p-[10px] h-[130px]">
              <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                <IoGrid className="h-[20px] w-[20px]" />
                Generate Print
              </span>
              {/* <p className="font-[350] text-[13px] mt-[10px]">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Repellendus, inventore!
                </p> */}
              <a
                href="#"
                className="font-[350] text-[13px] mt-[10px] text-blue-200"
              >
                Explore Generate Print
              </a>
            </div>
            <Separator className="bg-slate-200 text-slate-200" />
            <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px]">
              {renderMenu(printMenu, setSheetOpen)}
            </ul>
          </div>
        </div>
      </li>{" "}
      <li className="group">
        <div
          className={
            "flex justify-between items-center py-[10px] hover:bg-cyan-800 p-[10px] group-hover:bg-cyan-800 rounded-md cursor-pointer"
          }
        >
          <span className="flex gap-[10px] items-center cursor-pointer">
            <RiCustomerService2Line className="h-[20px] w-[20px]" />
            Customer Enquiry
          </span>
          <ChevronRight />
        </div>
        <div className=" top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md  right-[0] w-[0]  opacity-0 overflow-hidden  transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
          <div className="min-w-[400px]">
            <div className="p-[10px] h-[130px]">
              <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
                <IoGrid className="h-[20px] w-[20px]" />
                Customer Enquiry
              </span>
              {/* <p className="font-[350] text-[13px] mt-[10px]">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Repellendus, inventore!
                </p> */}
              <a
                href="#"
                className="font-[350] text-[13px] mt-[10px] text-blue-200"
              >
                Explore Customer Enquiry
              </a>
            </div>
            <Separator className="bg-slate-200 text-slate-200" />
            <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px]">
              {renderMenu(customerEnquiry, setSheetOpen)}
            </ul>
          </div>
        </div>
      </li>
      {/* Other non-client menu items */}
    </>
  );

  // Define the menu for clients
  const clientMenu = (
    <li className="group">
      <div className="flex justify-between items-center py-[10px] hover:bg-cyan-800 p-[10px] group-hover:bg-cyan-800 rounded-md cursor-pointer">
        <span className="flex gap-[10px] items-center cursor-pointer">
          <RiCustomerService2Line className="h-[20px] w-[20px]" />
          Customer Enquiry
        </span>
        <ChevronRight />
      </div>
      <div className="top-[20px] bottom-[20px] z-[-9] bg-cyan-950 shadow absolute border-l border-slate-600 rounded-md right-[0] w-[0] opacity-0 overflow-hidden transition-all duration-500 group-hover:w-[400px] group-hover:opacity-100 group-hover:right-[-400px]">
        <div className="min-w-[400px]">
          <div className="p-[10px] h-[130px]">
            <span className="flex gap-[10px] items-center cursor-pointer text-[18px] opacity-0 group-hover:opacity-100 transition-all duration-500">
              <IoGrid className="h-[20px] w-[20px]" />
              Customer Enquiry
            </span>
            <a
              href="#"
              className="font-[350] text-[13px] mt-[10px] text-blue-200"
            >
              Explore Customer Enquiry
            </a>
          </div>
          <Separator className="bg-slate-200 text-slate-200" />
          <ul className="p-[10px] overflow-y-auto h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-cyan-800 scrollbar-track-gray-300 flex flex-col gap-[10px]">
            {renderMenu(customerEnquiryClient, setSheetOpen)}
          </ul>
        </div>
      </div>
    </li>
  );

  return (
    <div
      ref={modalRef}
      className={`absolute h-[100vh] w-[300px] z-[30] top-0 bg-cyan-950 transition-all duration-500 ${
        sheetOpen ? "left-[60px]" : "left-[-300px]"
      }`}
    >
      <FaArrowLeftLong
        onClick={() => setSheetOpen(false)}
        className="text-[20px] cursor-pointer absolute top-[10px] right-[10px] text-white"
      />

      <ul className="flex flex-col text-white p-[5px] mt-[50px]">
        {/* {isClient ? clientMenu : nonClientMenu} */}
        {nonClientMenu}
      </ul>
    </div>
  );
};

export default SidebarMenues;
