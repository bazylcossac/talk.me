import { createSlice } from "@reduxjs/toolkit";
import { callStatus, userStatus } from "../../lib/constants";
import { GroupCallDataType, userDataType } from "@/types/types";

const initialState = {
  loggedUser: {} as userDataType,
  calleData: {} as userDataType,
  userActiveStatus: userStatus.ACTIVE,
  activeUsers: [] as userDataType[],
  activeGroups: [] as GroupCallDataType[],
  userCallState: callStatus.CALL_AVAILABLE,
  micEnabled: true,
  cameraEnabled: true,
  screenSharingEnabled: false,
  screenSharingLowOptions: false,
  localCameraHide: false,
  hasCreatedGroupCall: false,
  isInGroupCall: false,
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
    setCalleData: (state, action) => {
      state.calleData = action.payload;
    },
    setMicEnabled: (state, action) => {
      state.micEnabled = action.payload;
    },
    setCameraEnabled: (state, action) => {
      state.cameraEnabled = action.payload;
    },
    setScreenSharingEnabled: (state, action) => {
      state.screenSharingEnabled = action.payload;
    },
    setScreenSharingLowOptions: (state, action) => {
      console.log(action.payload);
      state.screenSharingLowOptions = action.payload;
    },
    setLocalCameraHide: (state, action) => {
      state.localCameraHide = action.payload;
    },
    setActiveGroups: (state, action) => {
      state.activeGroups = action.payload;
    },
    setHasCreatedGroupCall: (state, action: { payload: boolean }) => {
      state.hasCreatedGroupCall = action.payload;
    },
    setIsInGroupCall: (state, action: { payload: boolean }) => {
      state.isInGroupCall = action.payload;
    },
  },
});

export const {
  setCurrentlyLoggedUser,
  setUserActiveStatus,
  setActiveUsers,
  setCallStatus,
  setCalleData,
  setMicEnabled,
  setCameraEnabled,
  setScreenSharingEnabled,
  setScreenSharingLowOptions,
  setLocalCameraHide,
  setActiveGroups,
  setHasCreatedGroupCall,
  setIsInGroupCall,
} = userSlice.actions;

export default userSlice.reducer;
