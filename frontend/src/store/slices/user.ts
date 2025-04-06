import { createSlice } from "@reduxjs/toolkit";
import { callStatus, userStatus } from "../../lib/constants";
import { userDataType } from "@/types/types";

const initialState = {
  loggedUser: {} as userDataType,
  userActiveStatus: userStatus.ACTIVE,
  activeUsers: [] as userDataType[],
  userCallState: callStatus.CALL_AVAILABLE,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCurrentlyLoggedUser: (state, action) => {
      state.loggedUser = action.payload;
    },
    setUserActiveStatus: (state, action) => {
      state.userActiveStatus = action.payload;
    },
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    setCallStatus: (state, action) => {
      state.userCallState = action.payload;
    },
  },
});

export const {
  setCurrentlyLoggedUser,
  setUserActiveStatus,
  setActiveUsers,
  setCallStatus,
} = userSlice.actions;

export default userSlice.reducer;
