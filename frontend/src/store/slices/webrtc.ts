import { userDataType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null as MediaStream | null,
  remoteStream: null as MediaStream | null,
  groupCallStreams: null as MediaStream[] | null,
  micEnabled: true,
  cameraEnabled: true,
  showCallButtons: false,
  screenSharingEnabled: false,
  screenSharingLowOptions: false,
  callingUsersData: [] as userDataType[],
  rejectAnswer: {
    reject: false,
    answer: "",
  },
};

const webrtcSlice = createSlice({
  name: "webrtc",
  initialState: initialState,
  reducers: {
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
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
      state.screenSharingLowOptions = action.payload;
    },
    setCallingUserData: (state, action) => {
      state.callingUsersData = action.payload;
    },
    setRejectAnswer: (state, action) => {
      state.rejectAnswer = action.payload;
    },
  },
});

export const {
  setMicEnabled,
  setCameraEnabled,
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
  setRejectAnswer,
  setScreenSharingEnabled,
  setScreenSharingLowOptions,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
