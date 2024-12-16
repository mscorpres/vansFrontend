import { toggleFavorite } from "@/features/auth/FavoriteSlice";
import { Props } from "@/types/MainLayout";
import React from "react";
import { FaStar } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";
import { CgArrowTopRight } from "react-icons/cg";
const FavoriteSidebar: React.FC<Props> = ({ uiState }) => {
  const { favoriteref, setFavoriteSheet, favoriteSheet } = uiState;
  const favoriteItems = useSelector(
    (state: any) => state.favorites.favoriteItems
  );
  const dispatch = useDispatch();

  const handleToggleFavorite = (item: any) => {
    dispatch(toggleFavorite(item)); // Dispatch the action to toggle favorite
  };
  return (
    <div
      ref={favoriteref}
      className={`absolute  h-[100vh] w-[300px] z-100 top-0 bg-cyan-950 transition-all duration-500 ${
        favoriteSheet ? "left-[60px]" : "left-[-300px]"
      }`}
    >
      <FaArrowLeftLong
        onClick={() => setFavoriteSheet(false)}
        className="text-[20px] cursor-pointer absolute top-[10px] right-[10px] text-white"
      />
      <div className="mt-[50px]">
        {favoriteItems.map((item: any, index: number) => (
          <ul className="flex flex-col px-[5px]  text-white">
            <div className="flex items-center justify-between w-full">
              <Link
                onClick={() => setFavoriteSheet(false)}
                to={item.path}
                className="w-full hover:no-underline hover:bg-cyan-700 p-[10px] rounded-md cursor-pointer flex items-center gap-[10px]"
              >
                {item.name}
                <CgArrowTopRight className="h-[20px] w-[20px] font-[600]" />
              </Link>
              {/* <CustomTooltip message="Add to favorite" side="right"> */}
              <div className="h-[30px] min-w-[30px] flex justify-center items-center hover:bg-white hover:text-cyan-600 transition-all cursor-pointer rounded-md">
                <FaStar
                  className="h-[18px] w-[18px]"
                  onClick={() => handleToggleFavorite(item)}
                />
              </div>
              {/* </CustomTooltip>{" "} */}
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default FavoriteSidebar;
