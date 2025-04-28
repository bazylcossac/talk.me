import Peer, { DataConnection, MediaConnection } from "peerjs";
import {
  sendCloseGroupCallRequest,
  sendGroupUsersUpdate,
  sendJoinRequest,
  sendKickUserRequest,
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
import { isCallPossible } from "@/functions/isCallPossible";
import { userDataType } from "@/types/types";
import handleDataChannelMessages from "@/functions/handleDataChannelMessages";
import getPeerIdsFromGroup from "@/functions/getPeerIdsFromGroup";

export let myPeerId: string;
export let peer: Peer;
export let currentGroupId: string;
export let callPeerId: string;
export let currentCall: MediaConnection | null;
export let dataChannelGroup: DataConnection | null;
const groupPeerIds = [] as string[];
// const recivedBuffers = [] as ArrayBuffer[];

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

  peer.on("connection", (dataConnection) => {
    console.log(dataConnection);
    dataChannelGroup = dataConnection;
    dataChannelGroup.on("data", (data) => {
      handleDataChannelMessages(data);
    });
  });

  peer.on("call", async (call) => {
    const localStream = store.getState().webrtc.localStream;
    if (!localStream) {
      toast.error("Failed to get media devicess");
    }
    currentCall = call;
    call.answer(localStream!);

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

export const createGroupCall = async (
  groupName: string,
  groupPassword: string | null
) => {
  await createGroupPeerConnection();

  await setUpLocalStream();
  const roomId = crypto.randomUUID();
  currentGroupId = roomId;
  sendRequestOpenGroupCall(myPeerId, roomId, groupName, groupPassword);
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
  if (!roomId) return;
  console.log("CLOSING CALL");
  store.dispatch(setIsInGroupCall(false));
  clearAfterClosingConnection();
  disconnectFromRoom(roomId);
  store.dispatch(setNewGroupCallStreams([]));
  store.dispatch(setNewGroupCallUsers([]));
  dataChannelGroup?.close();
  currentGroupId = "";
  currentCall = null;
};

export const joinGroupCall = async (peerId: string, roomId: string) => {
  const possible = await isCallPossible(roomId);
  if (!possible) {
    toast.error("Already max users in call!");
    return;
  }
  handleDisconnectFromGroupCall(currentGroupId);
  await createGroupPeerConnection();

  await setUpLocalStream();
  currentGroupId = roomId;
  const loggedUser = store.getState().user.loggedUser;
  const localStream = store.getState().webrtc.localStream;
  if (!localStream) {
    toast("Failed to get media devices");
    return;
  }

  // createDataConnection(peerId);

  // dodac liste peerow w grupie
  const data = {
    peerId: myPeerId,
    roomId: roomId,
    streamId: localStream.id,
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

  const ids = await getPeerIdsFromGroup(roomId);

  const filteredIds = ids.ids.filter((id: string) => id !== myPeerId);
  connectToAllPeers(filteredIds);

  console.log(ids);

  store.dispatch(setIsInGroupCall(true));
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  store.dispatch(setUserActiveStatus(userStatus.IN_CALL));
};

export const connectToGroupCall = (data: {
  user: userDataType;
  streamId: string;
  roomId: string;
  peerId: string;
}) => {
  groupPeerIds.push(data.peerId);
  // connectToAllPeers(groupPeerIds);

  const localStream = store.getState().webrtc.localStream;
  if (!localStream) {
    toast("Failed to get media devices");
    return;
  }

  callPeerId = data.peerId;

  const call = peer.call(data.peerId, localStream);

  console.log("CURRENT CALL");
  console.log(currentCall);

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
  const user = store.getState().user.loggedUser;

  if (!localStream) return;
  // dodac od razu zalogowanego uzytkownika bedzie latwiej>??

  sendLeaveGroupCallRequest({
    socketId: user.socketId!,
    roomId: currentGroupId,
  });

  handleDisconnectFromGroupCall(currentGroupId);
};

export const handleUserGroupCallDisconnect = (
  socketId: string,
  roomId: string
) => {
  const groupCallUsers = store.getState().webrtc.groupCallUsers;
  const userToRemove = groupCallUsers.find(
    (user) => user.user.socketId === socketId
  );
  console.log("USER TO REMOVE");
  console.log(socketId);
  console.log(userToRemove);
  const streamid = userToRemove?.streamId;

  const newUsers = groupCallUsers.filter(
    (user) => user.user.socketId !== socketId
  );

  const streams = store.getState().webrtc.groupCallStreams;
  console.log(streams);

  const newStreams = streams.filter((stream) => stream.id !== streamid);

  store.dispatch(setNewGroupCallUsers(newUsers));
  store.dispatch(setNewGroupCallStreams(newStreams));

  sendGroupUsersUpdate({
    user: userToRemove!,
    roomId,
    type: "remove",
  });
};

export const handleKickUser = (socketId: string) => {
  sendKickUserRequest(socketId);
};

export const connectToAllPeers = (peerIds: string[]) => {
  peerIds.forEach((peerId) => {
    dataChannelGroup = peer.connect(peerId);
    dataChannelGroup.on("open", () => {
      console.log("data channel group open");
    });
    dataChannelGroup.on("data", (data) => {
      handleDataChannelMessages(data);
    });
  });
};

export const createDataConnection = (peerId: string) => {
  dataChannelGroup = peer.connect(peerId);
  dataChannelGroup.on("open", () => {
    console.log("data channel group open");
  });
  dataChannelGroup.on("data", (data) => {
    handleDataChannelMessages(data);
  });
};
