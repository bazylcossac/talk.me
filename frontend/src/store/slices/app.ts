import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leftContainerVisible: true,
  rightContainerVisible: true,
  usersTableVisible: true,
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
    setUsersTableVisible: (state, action) => {
      state.usersTableVisible = action.payload;
    },
  },
});

export const {
  setLeftContainerVisible,
  setRightContainerVisible,
  setUsersTableVisible,
} = appSlice.actions;

export default appSlice.reducer;
