import { configureStore } from "@reduxjs/toolkit";
import webrtcReducer from "./webrtc";

const store = configureStore({
  reducer: {
    webrtc: webrtcReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
