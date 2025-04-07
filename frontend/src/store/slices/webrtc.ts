import { userDataType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null as MediaStream | null,
  remoteStream: null as MediaStream | null,
  groupCallStreams: null as MediaStream[] | null,
  micEnabled: true,
  cameraEnabled: true,
  callingUsersData: [] as userDataType[],
  rejectAnswer: []
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
    setCallingUserData: (state, action) => {
      state.callingUsersData = action.payload;
    },
  },
});

export const {
  setMicEnabled,
  setCameraEnabled,
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
