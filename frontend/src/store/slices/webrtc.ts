import { chatMessageType, userDataType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null as MediaStream | null,
  remoteStream: null as MediaStream | null,
  screenSharingStrem: null as MediaStream | null,
  groupCallStreams: null as MediaStream[] | null,
  micEnabled: true,
  cameraEnabled: true,
  showCallButtons: false,
  localCameraHide: false,
  screenSharingEnabled: false,
  screenSharingLowOptions: false,
  selectedInputDeviceId: "",
  selectedOutputDeviceId: "",
  selectedCameraDeviceId: "",
  currentCallChatMessages: [] as chatMessageType[],
  callingUsersData: [] as userDataType[],
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
    setScreenSharingScreen: (state, action) => {
      state.screenSharingStrem = action.payload;
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
    setSelectedInputDeviceId: (state, action) => {
      state.selectedInputDeviceId = action.payload;
    },
    setSelectedOutputDeviceId: (state, action) => {
      state.selectedOutputDeviceId = action.payload;
    },
    setSelectedCameraDeviceId: (state, action) => {
      state.selectedCameraDeviceId = action.payload;
    },
    setCallingUserData: (state, action) => {
      state.callingUsersData = action.payload;
    },
    setLocalCameraHide: (state, action) => {
      state.localCameraHide = action.payload;
    },

    setCurrentCallMessages: (state, action) => {
      const newMessages = [action.payload, ...state.currentCallChatMessages];
      state.currentCallChatMessages = newMessages.reverse();
    },
  },
});

export const {
  setMicEnabled,
  setCameraEnabled,
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
  setScreenSharingScreen,
  setScreenSharingEnabled,
  setScreenSharingLowOptions,
  setSelectedInputDeviceId,
  setSelectedOutputDeviceId,
  setSelectedCameraDeviceId,
  setLocalCameraHide,
  setCurrentCallMessages,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
