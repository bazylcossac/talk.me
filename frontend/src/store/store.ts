import { configureStore } from "@reduxjs/toolkit";
import webrtcReducer from "./slices/webrtc";
import userReducer from "./slices/user";

const store = configureStore({
  reducer: {
    user: userReducer,
    webrtc: webrtcReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "webrtc/setLocalStream",
          "webrtc/setRemoteStream",
          "webrtc/setScreenSharingScreen",
        ],
        ignoredPaths: [
          "webrtc.localStream",
          "webrtc.remoteStream",
          "webrtc.screenSharingStrem",
        ],
      },
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
