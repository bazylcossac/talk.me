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
    setLeftContainerVisible: (state, { payload }: { payload: boolean }) => {
      state.leftContainerVisible = payload;
    },
    setRightContainerVisible: (state, { payload }: { payload: boolean }) => {
      state.rightContainerVisible = payload;
    },
    setFriendsTableVisible: (state, { payload }: { payload: boolean }) => {
      state.friendsTableVisible = payload;
    },
  },
});

export const {
  setLeftContainerVisible,
  setRightContainerVisible,
  setFriendsTableVisible,
} = appSlice.actions;

export default appSlice.reducer;
