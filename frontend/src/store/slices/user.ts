import { createSlice } from "@reduxjs/toolkit";
import { callStatus, userStatus } from "../../lib/constants";
import { userDataType } from "@/types/types";

const initialState = {
  loggedUser: {} as userDataType,
  userActiveStatus: userStatus.ACTIVE,
  activeUsers: [] as userDataType[],
  userCallState: callStatus.CALL_AVAILABLE,
  leftContainerVisible: true,
  rightContainerVisible: true,
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
      const filteredUsers = action.payload.filter(
        (user: userDataType) => user.socketId !== state.loggedUser.socketId
      );
      state.activeUsers = filteredUsers;
    },
    setCallStatus: (state, action) => {
      state.userCallState = action.payload;
    },
    setLeftContainerVisible: (state, action) => {
      state.leftContainerVisible = action.payload;
    },
    setRightContainerVisible: (state, action) => {
      state.rightContainerVisible = action.payload;
    },
  },
});

export const {
  setCurrentlyLoggedUser,
  setUserActiveStatus,
  setActiveUsers,
  setCallStatus,
  setLeftContainerVisible,
  setRightContainerVisible
} = userSlice.actions;

export default userSlice.reducer;
