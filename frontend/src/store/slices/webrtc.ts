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
    setLocalStream: (state, { payload }: { payload: MediaStream | null}) => {
      state.localStream = payload;
    },
    setRemoteStream: (state, { payload }: { payload: MediaStream | null}) => {
      state.remoteStream = payload;
    },
    setScreenSharingScreen: (state, { payload }: { payload: MediaStream }) => {
      state.screenSharingStrem = payload;
    },

    setSelectedInputDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedInputDeviceId = payload;
    },
    setSelectedOutputDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedOutputDeviceId = payload;
    },
    setSelectedCameraDeviceId: (state, { payload }: { payload: string }) => {
      state.selectedCameraDeviceId = payload;
    },
    setCallingUserData: (state, { payload }: { payload: userDataType[] }) => {
      state.callingUsersData = payload;
    },
    setCurrentCallMessages: (state, { payload }: { payload: chatItemType }) => {
      const newMessages = state.currentCallChatMessages;
      newMessages.push(payload);
      state.currentCallChatMessages = newMessages;
    },
    clearCurrentCallMessages: (state) => {
      state.currentCallChatMessages = [];
    },
    setGroupCallStreams: (state, { payload }: { payload: MediaStream }) => {
      const streams = state.groupCallStreams;
      streams.push(payload);

      state.groupCallStreams = streams;
    },
    setNewGroupCallStreams: (
      state,
      { payload }: { payload: MediaStream[] }
    ) => {
      state.groupCallStreams = payload;
    },
    setGroupCallUsers: (
      state,
      { payload }: { payload: groupCallUserDataType }
    ) => {
      const users = state.groupCallUsers;
      users.push(payload);
      state.groupCallUsers = users;
    },
    setNewGroupCallUsers: (
      state,
      { payload }: { payload: groupCallUserDataType[] }
    ) => {
      state.groupCallUsers = payload;
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
