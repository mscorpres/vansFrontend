import { Props } from "@/types/MainLayout";
import React from "react";
import { FaStar } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
const FavoriteSidebar: React.FC<Props> = ({ uiState }) => {
  const { favoriteref, setFavoriteSheet, favoriteSheet } = uiState;
  return (
    <div
      ref={favoriteref}
      className={`absolute  h-[100vh] w-[300px] z-[30] top-0 bg-cyan-950 transition-all duration-500 ${
        favoriteSheet ? "left-[60px]" : "left-[-300px]"
      }`}
    >
      <FaArrowLeftLong
        onClick={() => setFavoriteSheet(false)}
        className="text-[20px] cursor-pointer absolute top-[10px] right-[10px] text-white"
      />
      <div className="mt-[50px]">
        <ul className="mt-[10px] p-[10px] flex flex-col  text-white">
          <li className="w-full ">
            <Link
              to={"master/material"}
              className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md cursor-pointer flex items-center justify-between"
            >
              Material <FaStar className="h-[20px] w-[20px]" />
            </Link>
          </li>
          <li className="w-full">
            <Link
              to={"/master/service"}
              className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md cursor-pointer flex items-center justify-between"
            >
              Service <FaStar className="h-[20px] w-[20px]" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FavoriteSidebar;
