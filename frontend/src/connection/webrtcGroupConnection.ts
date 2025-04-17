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
  setUpLocalStream,
} from "./webrtcConnection";
import { getCredentials } from "@/functions/getCredentials";
import { setGroupCallStreams } from "@/store/slices/webrtc";

let peerId: string;
let peer: any;

export const createGroupPeerConnection = async () => {
  const credentials = await getCredentials();
  peer = new Peer({
    host: "localhost",
    port: 3000,
    path: "/peerjs",
    config: credentials,
  });

  peer.on("open", (id: string) => {
    console.log("PEER JS USER ", id);
    peerId = id;
  });
  peer.on("call", (call) => {
    const localStream = store.getState().webrtc.localStream;
    call.answer(localStream);

    call.on("stream", (stream: MediaStream) => {
      console.log("recived stream");

      store.dispatch(setGroupCallStreams(stream));
    });
  });
};

export const createGroupCall = async () => {
  await createGroupPeerConnection();
  await setUpLocalStream();
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

export const joinGroupCall = async (peerId: string, roomId: string) => {
  await createGroupPeerConnection();
  await setUpLocalStream();
  const localStream = store.getState().webrtc.localStream;
  console.log("CONECTING TO: ", peerId);
  peer.call(peerId, localStream);
  /// CONNECT TO ROOM
};
