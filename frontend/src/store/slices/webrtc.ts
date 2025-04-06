import { userDataType } from "@/types/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  micEnabled: true,
  cameraEnabled: true,
  callingUserData: {} as userDataType,
};

const webrtcSlice = createSlice({
  name: "webrtc",
  initialState: initialState,
  reducers: {
    setMicEnabled: (state, action) => {
      state.micEnabled = action.payload;
    },
    setCameraEnabled: (state, action) => {
      state.cameraEnabled = action.payload;
    },
    setCallingUserData: (state, action) => {
      state.callingUserData = action.payload;
    },
  },
});

export const { setMicEnabled, setCameraEnabled, setCallingUserData } =
  webrtcSlice.actions;

export default webrtcSlice.reducer;
