import {
  callStatus,
  configuration,
  preOfferAnswerStatus,
  screenSharingHighQualityOptions,
  screenSharingLowQualityOptions,
  userStatus,
} from "@/lib/constants";
import { setCallStatus } from "@/store/slices/user";
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
  setCallingUserData,
  setLocalStream,
  setRemoteStream,
  setScreenSharingEnabled,
  setScreenSharingScreen,
} from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";
import { toast } from "sonner";

let callerSocketId: string | null;
let peerConnection = null as RTCPeerConnection | null;
let currentRoomId: string | null;
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

export const handlePreOffer = ({
  caller,
  roomId,
}: {
  caller: userDataType;
  roomId: string;
}) => {
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
        callerSocketId: caller.socketId,
      });
    }
    if (activeStatus === userStatus.DONT_DISTURB)
      sendPreOfferAnswer({
        answer: preOfferAnswerStatus.CALL_UNVAILABLE,
        callerSocketId: caller.socketId,
      });
  }
};

export const handlePreOfferAnswer = ({
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
    sendOffer(socketId, roomId!);
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
    roomId,
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
      currentRoomId,
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
};

export const handleScreenSharing = async (screenSharingEnabled: boolean) => {
  if (screenSharingEnabled) {
    const isLowMedia = store.getState().webrtc.screenSharingLowOptions;

    const qualityMode = isLowMedia
      ? screenSharingLowQualityOptions
      : screenSharingHighQualityOptions;

    const screenSharingStream = await navigator.mediaDevices.getDisplayMedia(
      qualityMode
    );
    store.dispatch(setScreenSharingScreen(screenSharingStream));
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
    store.dispatch(setScreenSharingScreen(null));
  }
};

export const changeScreenSharingResolution = async () => {
  const callState = store.getState().user.userCallState;

  if (callState === callStatus.CALL_IN_PROGRESS) {
    const screenSharingStream = store.getState().webrtc.screenSharingStrem;
    screenSharingStream?.getTracks().forEach((track) => track.stop);

    handleScreenSharing(true);
  }
};

export const changeInputDevice = async (
  deviceId: string,
  deviceType: "input" | "camera"
) => {
  const callState = store.getState().user.userCallState;
  if (callState === callStatus.CALL_IN_PROGRESS) {
    if (deviceType === "camera") {
      try {
        const selectedInputDeviceId =
          store.getState().webrtc.selectedInputDeviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: selectedInputDeviceId
            ? { deviceId: { exact: selectedInputDeviceId } }
            : true,
          video: { deviceId: { exact: deviceId } },
        });
        store.dispatch(setLocalStream(stream));
      } catch {
        toast.error("Failed to change camera");
      }
    } else if (deviceType === "input") {
      try {
        const selectedCameraDeviceId =
          store.getState().webrtc.selectedCameraDeviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedCameraDeviceId
            ? { deviceId: { exact: selectedCameraDeviceId } }
            : true,
          audio: { deviceId: { exact: deviceId } },
        });
        store.dispatch(setLocalStream(stream));
      } catch {
        toast.error("Failed to change camera");
      }
    }
  }
};

export const disconnectFromRoom = (roomId: string) => {
  handleDisconnectFromRoom(roomId);
};
