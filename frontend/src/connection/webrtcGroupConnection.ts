import Peer from "peerjs";
import {
  sendCloseGroupCallRequest,
  sendJoinRequest,
  sendLeaveGroupCallRequest,
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
import {
  setGroupCallStreams,
  setGroupCallUsers,
  setNewGroupCallStreams,
  setNewGroupCallUsers,
} from "@/store/slices/webrtc";
import { toast } from "sonner";

let myPeerId: string;
let peer: any;
let currentGroupId: string;

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
  const roomId = crypto.randomUUID();
  currentGroupId = roomId;
  sendRequestOpenGroupCall(myPeerId, roomId);
  store.dispatch(setHasCreatedGroupCall(true));
  store.dispatch(setIsInGroupCall(true));
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  store.dispatch(setUserActiveStatus(userStatus.IN_CALL));
  const stream = store.getState().webrtc.localStream;
  const loggedUser = store.getState().user.loggedUser;
  if (!stream) {
    toast("Failed to create room. No media devices");
  }
  const data = {
    peerId: myPeerId,
    roomId: roomId,
    streamId: stream!.id,
    user: { ...loggedUser },
  };
  store.dispatch(setGroupCallUsers(data));
};

// cleanup function after disconnecting from group call
export const handleDisconnectFromGroupCall = (roomId: string) => {
  console.log("CLOSING CALL");
  store.dispatch(setIsInGroupCall(false));
  clearAfterClosingConnection();
  disconnectFromRoom(roomId);
  store.dispatch(setGroupCallStreams([]));
  store.dispatch(setGroupCallUsers([]));
  currentGroupId = "";
};

export const joinGroupCall = async (peerId: string, roomId: string) => {
  await createGroupPeerConnection();

  await setUpLocalStream();
  currentGroupId = roomId;
  const loggedUser = store.getState().user.loggedUser;
  const localStream = store.getState().webrtc.localStream;
  if (!localStream) {
    toast("Failed to get media devices");
    return;
  }
  const data = {
    peerId: myPeerId,
    roomId: roomId,
    streamId: localStream!.id,
    user: { ...loggedUser },
  };
  store.dispatch(setGroupCallUsers(data));

  console.log("CONECTING TO: ", peerId);
  sendJoinRequest({
    streamId: localStream.id,
    user: loggedUser,
    roomId,
    peerId: myPeerId,
  });
  store.dispatch(setIsInGroupCall(true));
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  store.dispatch(setUserActiveStatus(userStatus.IN_CALL));

  /// CONNECT TO ROOM, send my data to show me in groups
};

export const connectToGroupCall = (data) => {
  const localStream = store.getState().webrtc.localStream;
  if (!localStream) {
    toast("Failed to get media devices");
    return;
  }

  const call = peer.call(data.peerId, localStream);

  call.on("stream", (stream: MediaStream) => {
    const groupCallStreams = store.getState().webrtc.groupCallStreams;

    const isStreamAdded = groupCallStreams.find(
      (groupStreams) => groupStreams.id === stream.id
    );

    if (!isStreamAdded) {
      store.dispatch(setGroupCallStreams(stream));
    }
  });
};

export const closeGroupCallByHost = () => {
  sendCloseGroupCallRequest(currentGroupId);
  handleDisconnectFromGroupCall(currentGroupId);
};

export const handleDisconnectMeFromGroupCall = (roomId: string) => {
  handleDisconnectFromGroupCall(roomId);
};

export const leaveGroupCall = () => {
  const localStream = store.getState().webrtc.localStream;
  if (!localStream) return;

  sendLeaveGroupCallRequest({
    streamId: localStream.id,
    roomId: currentGroupId,
  });

  handleDisconnectFromGroupCall(currentGroupId);
};

export const handleUserGroupCallDisconnect = (streamId: string) => {
  const groupCallUsers = store.getState().webrtc.groupCallUsers;
  const userToRemove = groupCallUsers.find(
    (user) => user.streamId === streamId
  );
  // const streamid = userToRemove?.streamId;

  const newUsers = groupCallUsers.filter((user) => user.streamId !== streamId);

  const streams = store.getState().webrtc.groupCallStreams;

  const newStreams = streams.filter((stream) => stream.id !== streamId);

  store.dispatch(setNewGroupCallUsers(newUsers));
  store.dispatch(setNewGroupCallStreams(newStreams));
};
