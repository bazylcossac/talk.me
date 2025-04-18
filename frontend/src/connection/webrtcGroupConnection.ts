import Peer from "peerjs";
import {
  sendJoinRequest,
  sendRequestOpenGroupCall,
} from "./webSocketConnection";
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
import { toast } from "sonner";

let myPeerId: string;
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
    myPeerId = id;
  });
  peer.on("call", (call) => {
    const localStream = store.getState().webrtc.localStream;
    call.answer(localStream);

    call.on("stream", (stream: MediaStream) => {
      console.log("recived stream");
      console.log(stream);
      const groupCallStreams = store.getState().webrtc.groupCallStreams;
      const isStreamAdded = groupCallStreams.find(
        (groupStreams) => groupStreams.id === stream.id
      );
      if (!isStreamAdded) {
        store.dispatch(setGroupCallStreams(stream));
      }
    });
  });
};

export const createGroupCall = async () => {
  await createGroupPeerConnection();
  await setUpLocalStream();
  sendRequestOpenGroupCall(myPeerId);
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
  const user = store.getState().user.loggedUser;
  const localStream = store.getState().webrtc.localStream;
  if (!localStream) {
    toast("Failed to get media devices");
    return;
  }
  const call = peer.call(peerId, localStream);

  console.log("CONECTING TO: ", peerId);
  sendJoinRequest({
    streamId: localStream.id,
    user: user,
    roomId,
    myPeerId,
  });
  store.dispatch(setIsInGroupCall(true));
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  store.dispatch(setUserActiveStatus(userStatus.IN_CALL));

  call.on("stream", (stream: MediaStream) => {
    const groupCallStreams = store.getState().webrtc.groupCallStreams;

    const isStreamAdded = groupCallStreams.find(
      (groupStreams) => groupStreams.id === stream.id
    );

    if (!isStreamAdded) {
      store.dispatch(setGroupCallStreams(stream));
    }
  });
  /// CONNECT TO ROOM, send my data to show me in groups
};

// export const connectToGroupCall = (data) => {
//     const localStream = store.getState().webrtc.localStream;
//     if (!localStream) {
//       toast("Failed to get media devices");
//       return;
//     }
// }
