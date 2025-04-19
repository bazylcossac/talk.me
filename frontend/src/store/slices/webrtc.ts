import { chatItemType, groupCallUserDataType } from "../../types/types";
import { userDataType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  localStream: null as MediaStream | null,
  remoteStream: null as MediaStream | null,
  screenSharingStrem: null as MediaStream | null,
  groupCallStreams: [] as MediaStream[],
  groupCallUsers: [] as groupCallUserDataType[],
  showCallButtons: false,
  selectedInputDeviceId: "",
  selectedOutputDeviceId: "",
  selectedCameraDeviceId: "",
  currentCallChatMessages: [] as chatItemType[],
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
    setCurrentCallMessages: (state, action) => {
      const newMessages = state.currentCallChatMessages;
      newMessages.push(action.payload);
      state.currentCallChatMessages = newMessages;
    },
    clearCurrentCallMessages: (state) => {
      state.currentCallChatMessages = [];
    },
    setGroupCallStreams: (state, action) => {
      const streams = state.groupCallStreams;
      streams.push(action.payload);

      state.groupCallStreams = streams;
    },
    setNewGroupCallStreams: (state, action) => {
      state.groupCallStreams = action.payload;
    },
    setGroupCallUsers: (state, action) => {
      const users = state.groupCallUsers;
      users.push(action.payload);
      state.groupCallUsers = users;
    },
    setNewGroupCallUsers: (state, action) => {
      state.groupCallUsers = action.payload;
    },
  },
});

export const {
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
  setScreenSharingScreen,
  setSelectedInputDeviceId,
  setSelectedOutputDeviceId,
  setSelectedCameraDeviceId,
  setCurrentCallMessages,
  clearCurrentCallMessages,
  setGroupCallStreams,
  setGroupCallUsers,
  setNewGroupCallUsers,
  setNewGroupCallStreams,
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
