import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leftContainerVisible: true,
  rightContainerVisible: true,
  friendsTableVisible: true,
};

const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setLeftContainerVisible: (state, action) => {
      state.leftContainerVisible = action.payload;
    },
    setRightContainerVisible: (state, action) => {
      state.rightContainerVisible = action.payload;
    },
    setFriendsTableVisible: (state, action) => {
      state.friendsTableVisible = action.payload;
    },
  },
});

export const {
  setLeftContainerVisible,
  setRightContainerVisible,
  setFriendsTableVisible,
} = appSlice.actions;

export default appSlice.reducer;
