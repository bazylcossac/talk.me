import { configureStore } from "@reduxjs/toolkit";
import webrtcReducer from "./slices/webrtc";
import userReducer from "./slices/user";
import appReducer from "./slices/app";

const store = configureStore({
  reducer: {
    user: userReducer,
    webrtc: webrtcReducer,
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "webrtc/setLocalStream",
          "webrtc/setRemoteStream",
          "webrtc/setScreenSharingScreen",
          "webrtc/setGroupCallStreams",
        ],
        ignoredPaths: [
          "webrtc.localStream",
          "webrtc.remoteStream",
          "webrtc.screenSharingStrem",
          "webrtc.groupCallStreams",
        ],
      },
    }),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
