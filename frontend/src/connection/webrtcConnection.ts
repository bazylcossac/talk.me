import { callStatus, preOfferAnswerStatus, userStatus } from "@/lib/constants";
import { setCallStatus } from "@/store/slices/user";
import store from "@/store/store";
import {
  handleSendOffer,
  handleSendPreOffer,
  handleUserActiveChange,
  sendPreOfferAnswer,
} from "./webSocketConnection";
import { setCallingUserData, setLocalStream } from "@/store/slices/webrtc";
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

let callerSocketId;
let peerConnection = null as RTCPeerConnection | null;

export const createPeerConection = () => {
  peerConnection = new RTCPeerConnection(configuration);
};

export const callToUser = async (calleSocketId: string) => {
  await setUpLocalStream();
  callerSocketId = calleSocketId; // setting userSocketId to calleSocketId, which is socket id that we want to connect with
  const currentUser = store.getState().user.loggedUser;
  handleSendPreOffer({
    caller: currentUser,
    calleSocketId: calleSocketId,
  });

  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  handleUserActiveChange(userStatus.IN_CALL);
};

export const setUpLocalStream = async () => {
  try {
    const localStream = await navigator.mediaDevices.getUserMedia(constraints);
    store.dispatch(setLocalStream(localStream));
    createPeerConection();
    store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  } catch {
    toast("Failed to get user media");
  }
};

// handling pre offers
// ACCEPT / REJECT

export const handlePreOffer = (data: userDataType) => {
  if (canUserConnectiWithMe()) {
    const activeIncomingCalls = store.getState().webrtc.callingUsersData;
    const isUserCurrentlyCallingYou = activeIncomingCalls.find(
      (user) => user.socketId === data.socketId
    );
    if (!isUserCurrentlyCallingYou) {
      const newIncomingCalls = [...activeIncomingCalls, data];
      store.dispatch(setCallingUserData(newIncomingCalls));
    }
    store.dispatch(setCallStatus(callStatus.CALL_REQUESTED));
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
    // handle rejection
  }
};

export const sendOffer = async (calleSocketId: string) => {
  const offer = await peerConnection!.createOffer();
  peerConnection!.setLocalDescription(offer);
  handleSendOffer({
    offer,
    calleSocketId: calleSocketId,
  });
};

export const handleOffer = async ({
  offer,
  calleSocketId,
}: {
  offer: RTCSessionDescriptionInit;
  calleSocketId: string;
}) => {
  await peerConnection?.setRemoteDescription(offer);
  const answer = await peerConnection?.createAnswer();
  await peerConnection?.setLocalDescription(answer);
  console.log("AA");
  console.log(callerSocketId);
  // sendOfferAnswer({

  // })
};

const canUserConnectiWithMe = () => {
  const activeStatus = store.getState().user.userActiveStatus;
  const currentCallStatus = store.getState().user.userCallState;
  if (
    activeStatus !== userStatus.DONT_DISTURB &&
    currentCallStatus !== callStatus.CALL_UNVAILABLE
  ) {
    return true;
  } else {
    return false;
  }
};

export const handleSendAcceptCall = ({
  callerSocketId,
}: {
  callerSocketId: string;
}) => {
  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
  handleUserActiveChange(userStatus.IN_CALL);
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketId
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  createPeerConection();
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_ACCEPTED,
    socketId: callerSocketId,
  });
};

export const handleRejectCall = ({
  callerSocketId,
}: {
  callerSocketId: string;
}) => {
  store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  handleUserActiveChange(userStatus.ACTIVE);
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketId
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_REJECTED,
    socketId: callerSocketId,
  });
};
