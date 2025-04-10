import {
  callStatus,
  configuration,
  constraints,
  preOfferAnswerStatus,
  screenSharingHighQualityOptions,
  screenSharingLowQualityOptions,
  userStatus,
} from "@/lib/constants";
import { setCallStatus } from "@/store/slices/user";
import store from "@/store/store";
import {
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
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
  setScreenSharingEnabled,
} from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";
import { toast } from "sonner";

let callerSocketId: string | null;
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
        socketId: callerSocketId as string,
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

    console.log(streamOptions);
    const localStream = await navigator.mediaDevices.getUserMedia(
      streamOptions
    );
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
    const callState = store.getState().user.userCallState;
    const activeStatus = store.getState().user.userActiveStatus;
    if (
      callState === callStatus.CALL_IN_PROGRESS ||
      activeStatus === userStatus.IN_CALL
    ) {
      sendPreOfferAnswer({
        answer: preOfferAnswerStatus.USER_CALL_IN_PROGRESS,
        callerSocketId: data.socketId,
      });
    }
    if (activeStatus === userStatus.DONT_DISTURB)
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
  if (store.getState().user.userCallState === callStatus.CALL_IN_PROGRESS) {
    sendCloseConnection({
      socketId: callerSocketId as string,
    });
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
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketID
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  console.log("caller socket id");
  console.log(callerSocketID);
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_REJECTED,
    socketId: callerSocketID,
  });
};

export const handleRejectedCall = () => {
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
    });
  }
  clearAfterClosingConnection();
};

export const handleOtherUserLeaveCall = () => {
  clearAfterClosingConnection();
};

const clearAfterClosingConnection = () => {
  peerConnection?.close();
  peerConnection = null;
  callerSocketId = null;
  store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  handleUserActiveChange(userStatus.ACTIVE);
  store.dispatch(setLocalStream(null));
  store.dispatch(setRemoteStream(null));
  store.dispatch(setScreenSharingEnabled(false));
};

export const handleScreenSharing = async (screenSharingEnabled: boolean) => {
  if (screenSharingEnabled) {
    const isLowMedia = store.getState().webrtc.screenSharingLowOptions;

    const qualityMode = isLowMedia
      ? screenSharingLowQualityOptions
      : screenSharingHighQualityOptions;

    console.log(qualityMode);
    const screenSharingStream = await navigator.mediaDevices.getDisplayMedia(
      qualityMode
    );
    const senders = await peerConnection!.getSenders();

    const sender = senders.find(
      (sender) =>
        sender.track!.kind === screenSharingStream.getVideoTracks()[0].kind
    );

    if (!sender) {
      toast("Failed to screern share");
      return;
    }
    sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
  } else if (!screenSharingEnabled) {
    const localStream = store.getState().webrtc.localStream;
    if (!localStream) {
      setUpLocalStream();
    }
    const senders = await peerConnection!.getSenders();

    const sender = senders.find(
      (sender) => sender.track!.kind === localStream?.getVideoTracks()[0].kind
    );

    if (!sender) {
      toast("Failed to switch back to camera");
      return;
    }

    sender.replaceTrack(localStream!.getVideoTracks()[0]);
  }
};

export const changeInputDevice = async (deviceId: string) => {
  const callState = store.getState().user.userCallState;
  if (callState === callStatus.CALL_IN_PROGRESS) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: { deviceId: { exact: deviceId } },
      });
      store.dispatch(setLocalStream(stream));
    } catch {
      toast.error("Failed to change input");
    }
  }
};
