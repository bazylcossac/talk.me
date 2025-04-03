import { configureStore } from "@reduxjs/toolkit";
import webrtcReducer from "./slices/webrtc";
import userReducer from "./slices/user";

const store = configureStore({
  reducer: {
    user: userReducer,
    webrtc: webrtcReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
