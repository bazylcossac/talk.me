import { createSlice } from "@reduxjs/toolkit";
import { userStatus } from "../../lib/constants";
import { userDataType } from "@/types/types";

const initialState = {
  userActiveStatus: userStatus.ACTIVE,
  activeUsers: [] as userDataType[],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUserActiveStatus: (state, action) => {
      state.userActiveStatus = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
  },
});

export const { setUserActiveStatus, setActiveUsers } = userSlice.actions;

export default userSlice.reducer;
