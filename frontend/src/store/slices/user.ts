import { createSlice } from "@reduxjs/toolkit";
import { userSatus } from "../../lib/constants";

const initialState = {
  userActiveStatus: userSatus.ACTIVE,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserActiveStatus: (state, action) => {
      state.userActiveStatus = action.payload;
    },
  },
});

export const { setUserActiveStatus } = userSlice.actions;

export default userSlice.reducer;
