import { createSlice } from "@reduxjs/toolkit";
import { callStatus, userStatus } from "../../lib/constants";
import { GroupCallDataType, userDataType } from "@/types/types";

const initialState = {
  loggedUser: {} as userDataType,
  calleData: {} as userDataType | null,
  userActiveStatus:
    userStatus.ACTIVE as (typeof userStatus)[keyof typeof userStatus],
  activeUsers: [] as userDataType[],
  activeGroups: [] as GroupCallDataType[],
  userCallState:
    callStatus.CALL_AVAILABLE as (typeof callStatus)[keyof typeof callStatus],
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
    setCurrentlyLoggedUser: (state, { payload }: { payload: userDataType }) => {
      state.loggedUser = payload;
    },
    setUserActiveStatus: (
      state,
      { payload }: { payload: (typeof userStatus)[keyof typeof userStatus] }
    ) => {
      state.userActiveStatus = payload;
    },
    setActiveUsers: (state, action) => {
      const filteredUsers = action.payload.filter(
        (user: userDataType) => user.socketId !== state.loggedUser.socketId
      );
      state.activeUsers = filteredUsers;
    },
    setCallStatus: (
      state,
      { payload }: { payload: (typeof callStatus)[keyof typeof callStatus] }
    ) => {
      state.userCallState = payload;
    },
    setCalleData: (state, { payload }: { payload: userDataType | null }) => {
      state.calleData = payload;
    },
    setMicEnabled: (state, { payload }: { payload: boolean }) => {
      state.micEnabled = payload;
    },
    setCameraEnabled: (state, { payload }: { payload: boolean }) => {
      state.cameraEnabled = payload;
    },
    setScreenSharingEnabled: (state, { payload }: { payload: boolean }) => {
      state.screenSharingEnabled = payload;
    },
    setScreenSharingLowOptions: (state, { payload }: { payload: boolean }) => {
      state.screenSharingLowOptions = payload;
    },
    setLocalCameraHide: (state, { payload }: { payload: boolean }) => {
      state.localCameraHide = payload;
    },
    setActiveGroups: (state, { payload }: { payload: GroupCallDataType[] }) => {
      state.activeGroups = payload;
    },
    setHasCreatedGroupCall: (state, { payload }: { payload: boolean }) => {
      state.hasCreatedGroupCall = payload;
    },
    setIsInGroupCall: (state, { payload }: { payload: boolean }) => {
      state.isInGroupCall = payload;
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
