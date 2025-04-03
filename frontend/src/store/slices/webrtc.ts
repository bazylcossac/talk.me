import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  micEnabled: true,
  cameraEnabled: true,
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
  },
});

export const { setMicEnabled, setCameraEnabled } = webrtcSlice.actions;

export default webrtcSlice.reducer;
