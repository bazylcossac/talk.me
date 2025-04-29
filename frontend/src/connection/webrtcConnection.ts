import { callStatus, preOfferAnswerStatus, userStatus } from "@/lib/constants";
import {
  setCalleData,
  setCallStatus,
  setScreenSharingEnabled,
} from "@/store/slices/user";
import store from "@/store/store";
import {
  handleDisconnectFromRoom,
  handleSendOffer,
  handleSendPreOffer,
  handleUserActiveChange,
  sendCloseConnection,
  sendIceCandidate,
  sendOfferAnswer,
  sendPreOfferAnswer,
  sendRejectAnswer,
} from "./webSocketConnection";
import {
  clearCurrentCallMessages,
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
} from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";
import { toast } from "sonner";
import { getCredentials } from "@/functions/getCredentials";
import { closeGroupCallByHost, leaveGroupCall } from "./webrtcGroupConnection";
import handleDataChannelMessages from "@/functions/handleDataChannelMessages";

export const recivedBuffers = [] as ArrayBuffer[];
let callerSocketId: string | null;
export let peerConnection = null as RTCPeerConnection | null;
let currentRoomId: string | null;
export let currentDataChannel = null as RTCDataChannel | null;

export const createPeerConection = async () => {
  const configuration = await getCredentials();
  peerConnection = new RTCPeerConnection(configuration);
  console.log(peerConnection);
  currentDataChannel = peerConnection?.createDataChannel("chat");

  const localStream = store.getState().webrtc.localStream;
  if (!localStream) return;

  localStream.getTracks().forEach((track) => {
    peerConnection?.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    store.dispatch(setRemoteStream(event.streams[0]));
  };
  peerConnection.onconnectionstatechange = () => {
    const state = peerConnection!.connectionState;
    if (state === "disconnected" || state === "failed") {
      peerConnection!.restartIce();
    }
    if (state === "connected") {
      console.log("CONNECTED TO USER");
      console.log(store.getState().webrtc.remoteStream);
      console.log(store.getState().webrtc.localStream);
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendIceCandidate({
        candidate: event.candidate,
        socketId: callerSocketId as string,
      });
    }
  };

  peerConnection.ondatachannel = (event) => {
    currentDataChannel = event.channel;
    console.log(currentDataChannel);
  };

  currentDataChannel.onmessage = (event) => {
    handleDataChannelMessages(event.data);
  };
  currentDataChannel.onopen = () => {
    console.log("DATA CHANNEL OPPENED");
  };
  currentDataChannel.onclose = () => {
    console.log("closing data channel");
    store.dispatch(clearCurrentCallMessages());
  };
};

export const callToUser = async (calleSocketId: string) => {
  callerSocketId = calleSocketId; // setting userSocketId to calleSocketId, which is socket id that we want to connect with
  const currentUser = store.getState().user.loggedUser;
  handleSendPreOffer({
    caller: currentUser,
    calleSocketId: calleSocketId,
  });
  handleUserActiveChange(userStatus.ACTIVE);
  await setUpLocalStream();
  await createPeerConection();

  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  handleUserActiveChange(userStatus.IN_CALL);
  console.log(store.getState().user.userCallState);
};

export const setUpLocalStream = async () => {
  try {
    const selectedInputDeviceId = store.getState().webrtc.selectedInputDeviceId;

    const selectedCameraDeviceId =
      store.getState().webrtc.selectedCameraDeviceId;

    const streamOptions = {
      audio: selectedInputDeviceId
        ? { deviceId: { exact: selectedInputDeviceId } }
        : true,
      video: selectedCameraDeviceId
        ? { deviceId: { exact: selectedCameraDeviceId } }
        : true,
    };

    const localStream = await navigator.mediaDevices.getUserMedia(
      streamOptions
    );
    store.dispatch(setLocalStream(localStream));
  } catch (err) {
    const error = err as Error;
    toast("Failed to get user media");
    clearAfterClosingConnection();
    throw new Error(`Failed to get user media | ${error.message}`);
  }
};

// handling pre offers
// ACCEPT / REJECT

export const handlePreOffer = ({
  caller,
  roomId,
}: {
  caller: userDataType;
  roomId: string;
}) => {
  store.dispatch(setCalleData(caller));
  const activeIncomingCalls = store.getState().webrtc.callingUsersData;
  const isUserCurrentlyCallingYou = activeIncomingCalls.find(
    (user) => user.socketId === caller.socketId
  );
  if (!isUserCurrentlyCallingYou) {
    const newIncomingCalls = [...activeIncomingCalls, { ...caller, roomId }];
    store.dispatch(setCallingUserData(newIncomingCalls));
  }
  if (canUserConnectiWithMe()) {
    store.dispatch(setCallStatus(callStatus.CALL_REQUESTED));
    currentRoomId = roomId;
  } else {
    const callState = store.getState().user.userCallState;
    const activeStatus = store.getState().user.userActiveStatus;
    if (
      callState === callStatus.CALL_IN_PROGRESS ||
      activeStatus === userStatus.IN_CALL
    ) {
      sendPreOfferAnswer({
        answer: preOfferAnswerStatus.USER_CALL_IN_PROGRESS,
        callerSocketId: caller.socketId as string,
      });
    }
    if (activeStatus === userStatus.DONT_DISTURB)
      sendPreOfferAnswer({
        answer: preOfferAnswerStatus.CALL_UNVAILABLE,
        callerSocketId: caller.socketId as string,
      });
  }
};

export const handlePreOfferAnswer = async ({
  answer,
  socketId,
  roomId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  socketId: string;
  roomId?: string;
}) => {
  if (answer === preOfferAnswerStatus.CALL_ACCEPTED) {
    console.log("ACCEPTED");
    console.log(socketId);
    await sendOffer(socketId, roomId!);
  } else {
    if (answer === preOfferAnswerStatus.CALL_UNVAILABLE) {
      toast("User don't want any calls rn.");
    } else if (answer === preOfferAnswerStatus.USER_CALL_IN_PROGRESS) {
      toast("User is currently in a call!", {
        className: "bg-black text-wite",
      });
    }
    if (answer === preOfferAnswerStatus.CALL_REJECTED) {
      sendRejectAnswer({
        socketId,
      });
    }
  }
};

export const sendOffer = async (calleSocketId: string, roomId: string) => {
  const offer = await peerConnection!.createOffer();

  peerConnection!.setLocalDescription(offer);
  handleSendOffer({
    offer,
    calleSocketId: calleSocketId,
    roomId,
  });
};

export const handleOffer = async ({
  offer,
  socketId,
  roomId,
}: {
  offer: RTCSessionDescriptionInit;
  socketId: string;
  roomId: string;
}) => {
  currentRoomId = roomId;
  await peerConnection?.setRemoteDescription(offer);
  const answer = await peerConnection!.createAnswer();
  await peerConnection?.setLocalDescription(answer);
  console.log(peerConnection!.connectionState);

  sendOfferAnswer({
    answer: answer,
    socketId: socketId,
  });
};

export const handleOfferAnswer = async ({
  answer,
}: {
  answer: RTCSessionDescriptionInit;
  socketId: string;
}) => {
  await peerConnection!.setRemoteDescription(answer);
  console.log(peerConnection!.connectionState);
};

const canUserConnectiWithMe = () => {
  const activeStatus = store.getState().user.userActiveStatus;
  const currentCallStatus = store.getState().user.userCallState;
  if (
    activeStatus === userStatus.DONT_DISTURB ||
    currentCallStatus === callStatus.CALL_UNVAILABLE ||
    currentCallStatus === callStatus.CALL_IN_PROGRESS
  ) {
    return false;
  } else {
    return true;
  }
};

export const handleSendAcceptCall = async ({
  callerSocketID,
  roomId,
}: {
  callerSocketID: string;
  roomId: string;
}) => {
  const callState = store.getState().user.userCallState;
  const isInGroupCall = store.getState().user.isInGroupCall;
  const hasCreatedGroupCall = store.getState().user.hasCreatedGroupCall;

  if (
    callState === callStatus.CALL_IN_PROGRESS &&
    peerConnection?.connectionState === "connected"
  ) {
    sendCloseConnection({
      socketId: callerSocketId as string,
      currentRoomId: roomId,
    });
  }

  if (isInGroupCall && hasCreatedGroupCall) {
    closeGroupCallByHost();
  }

  if (isInGroupCall && !hasCreatedGroupCall) {
    leaveGroupCall();
  }
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  callerSocketId = callerSocketID;
  handleUserActiveChange(userStatus.IN_CALL);
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketID
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  await setUpLocalStream();
  await createPeerConection();
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_ACCEPTED,
    socketId: callerSocketID,
    roomId,
  });
};

export const handleRejectCall = ({
  callerSocketID,
}: {
  callerSocketID: string;
}) => {
  console.log("USUWAM");
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketID
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  store.dispatch(setCalleData(null));
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_REJECTED,
    socketId: callerSocketID,
  });
};

export const handleRejectedCall = () => {
  store.dispatch(setCalleData(null));
  handleOtherUserLeaveCall();
  toast("User rejected call, sorry :'( ", {
    className: "bg-black text-white",
  });
};

export const handleCandidate = async (candidate: RTCIceCandidate) => {
  await peerConnection!.addIceCandidate(candidate);
};

export const handleLeaveCall = () => {
  console.log(callerSocketId);
  if (
    store.getState().user.userCallState === callStatus.CALL_IN_PROGRESS &&
    peerConnection!.connectionState === "connected"
  ) {
    sendCloseConnection({
      socketId: callerSocketId as string,
      currentRoomId: currentRoomId as string,
    });
  }
  clearAfterClosingConnection();
};

export const handleOtherUserLeaveCall = () => {
  clearAfterClosingConnection();
};

export const clearAfterClosingConnection = () => {
  peerConnection?.close();
  peerConnection = null;
  callerSocketId = null;
  currentRoomId = "";
  store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  handleUserActiveChange(userStatus.ACTIVE);
  store.dispatch(setLocalStream(null));
  store.dispatch(setRemoteStream(null));
  store.dispatch(setScreenSharingEnabled(false));
  store.dispatch(setCalleData(null));
  store.dispatch(clearCurrentCallMessages());

  console.log("WYCZYSZCZONE");
  console.log(store.getState().webrtc.currentCallChatMessages);
};

export const disconnectFromRoom = (roomId: string) => {
  handleDisconnectFromRoom(roomId);
  store.dispatch(clearCurrentCallMessages());
};
