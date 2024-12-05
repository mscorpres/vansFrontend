// src/store/favoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteItems: [], // Array to store the favorite items
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const item = action.payload;
      const isFavorited = state.favoriteItems.some(
        (fav) => fav.name === item.name
      );

      if (isFavorited) {
        // Remove the item from the favorites list if it's already there
        state.favoriteItems = state.favoriteItems.filter(
          (fav) => fav.name !== item.name
        );
      } else {
        // Add the item to the favorites list
        state.favoriteItems.push(item);
      }
    },
  },
});

// Export actions and reducer
export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
