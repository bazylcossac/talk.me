import Peer from "peerjs";
import { sendRequestOpenGroupCall } from "./webSocketConnection";
import store from "@/store/store";
import {
  setCallStatus,
  setHasCreatedGroupCall,
  setIsInGroupCall,
  setUserActiveStatus,
} from "@/store/slices/user";
import { callStatus, userStatus } from "@/lib/constants";
import {
  clearAfterClosingConnection,
  disconnectFromRoom,
} from "./webrtcConnection";

let peerId: string;
let peer;

export const createGroupPeerConnection = () => {
  peer = new Peer({
    host: "localhost",
    port: 3000,
    path: "/peerjs",
  });

  peer.on("open", (id) => {
    console.log("PEER JS USER ", id);
    peerId = id;
  });
};

export const createGroupCall = () => {
  createGroupPeerConnection();
  sendRequestOpenGroupCall(peerId);
  store.dispatch(setHasCreatedGroupCall(true));
  store.dispatch(setIsInGroupCall(true));
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  store.dispatch(setUserActiveStatus(userStatus.IN_CALL));
};

export const handleDisconnectFromGroupCall = (roomId: string) => {
  store.dispatch(setIsInGroupCall(false));
  clearAfterClosingConnection();
  disconnectFromRoom(roomId);
};
