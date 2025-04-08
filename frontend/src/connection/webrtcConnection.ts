import { callStatus, preOfferAnswerStatus, userStatus } from "@/lib/constants";
import { setCallStatus } from "@/store/slices/user";
import store from "@/store/store";
import {
  handleSendOffer,
  handleSendPreOffer,
  handleUserActiveChange,
  sendIceCandidate,
  sendOfferAnswer,
  sendPreOfferAnswer,
} from "./webSocketConnection";
import {
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
} from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";
import { toast } from "sonner";

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const constraints = {
  video: true,
  audio: true,
};

let callerSocketId: string;
let peerConnection = null as RTCPeerConnection | null;

export const createPeerConection = () => {
  peerConnection = new RTCPeerConnection(configuration);

  const localStream = store.getState().webrtc.localStream;
  if (!localStream) return;

  localStream.getTracks().forEach((track) => {
    peerConnection?.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    store.dispatch(setRemoteStream(event.streams[0]));
  };
  peerConnection.onconnectionstatechange = () => {
    if (peerConnection!.connectionState === "connected") {
      console.log("CONNECTED TO USER");
      console.log(store.getState().webrtc.remoteStream);
      console.log(store.getState().webrtc.localStream);
    }
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendIceCandidate({
        candidate: event.candidate,
        socketId: callerSocketId,
      });
    }
  };
};

export const callToUser = async (calleSocketId: string) => {
  callerSocketId = calleSocketId; // setting userSocketId to calleSocketId, which is socket id that we want to connect with
  const currentUser = store.getState().user.loggedUser;
  handleSendPreOffer({
    caller: currentUser,
    calleSocketId: calleSocketId,
  });
  await setUpLocalStream();

  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  handleUserActiveChange(userStatus.IN_CALL);
  console.log(store.getState().user.userCallState);
};

export const setUpLocalStream = async () => {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    store.dispatch(setLocalStream(localStream));
    createPeerConection();
    store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  } catch (err) {
    toast("Failed to get user media");
    console.error(err);
  }
};

// handling pre offers
// ACCEPT / REJECT

export const handlePreOffer = (data: userDataType) => {
  const activeIncomingCalls = store.getState().webrtc.callingUsersData;
  const isUserCurrentlyCallingYou = activeIncomingCalls.find(
    (user) => user.socketId === data.socketId
  );
  if (!isUserCurrentlyCallingYou) {
    const newIncomingCalls = [...activeIncomingCalls, data];
    store.dispatch(setCallingUserData(newIncomingCalls));
  }
  if (canUserConnectiWithMe()) {
    store.dispatch(setCallStatus(callStatus.CALL_REQUESTED));
  } else {
    sendPreOfferAnswer({
      answer: preOfferAnswerStatus.CALL_UNVAILABLE,
      callerSocketId: data.socketId,
    });
  }
};

export const handlePreOfferAnswer = ({
  answer,
  socketId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  socketId: string;
}) => {
  if (answer === preOfferAnswerStatus.CALL_ACCEPTED) {
    console.log("ACCEPTED");
    console.log(socketId);
    sendOffer(socketId);
  } else {
    if (answer === preOfferAnswerStatus.CALL_UNVAILABLE) {
      toast("User is in call, waiting...");
    }
  }
};

export const sendOffer = async (calleSocketId: string) => {
  const offer = await peerConnection!.createOffer();
  console.log("CREATING ANSWER!");
  peerConnection!.setLocalDescription(offer);
  handleSendOffer({
    offer,
    calleSocketId: calleSocketId,
  });
};

export const handleOffer = async ({
  offer,
  socketId,
}: {
  offer: RTCSessionDescriptionInit;
  socketId: string;
}) => {
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
  socketId,
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
}: {
  callerSocketID: string;
}) => {
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  callerSocketId = callerSocketID;
  handleUserActiveChange(userStatus.IN_CALL);
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketID
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  await setUpLocalStream();
  createPeerConection();
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_ACCEPTED,
    socketId: callerSocketID,
  });
};

export const handleRejectCall = ({
  callerSocketID,
}: {
  callerSocketID: string;
}) => {
  store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  handleUserActiveChange(userStatus.ACTIVE);
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketID
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_REJECTED,
    socketId: callerSocketID,
  });
};

export const handleCandidate = async (candidate: RTCIceCandidate) => {
  await peerConnection!.addIceCandidate(candidate);
};
