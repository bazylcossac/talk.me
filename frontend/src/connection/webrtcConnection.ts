import {
  callStatus,
  CHUNK_SIZE,
  preOfferAnswerStatus,
  screenSharingHighQualityOptions,
  screenSharingLowQualityOptions,
  userStatus,
} from "@/lib/constants";
import { setCalleData, setCallStatus } from "@/store/slices/user";
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
  setCurrentCallMessages,
  setLocalStream,
  setRemoteStream,
  setScreenSharingEnabled,
  setScreenSharingScreen,
} from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";
import { toast } from "sonner";
import { getCredentials } from "@/functions/getCredentials";

let recivedBuffers = [] as ArrayBuffer[];
let callerSocketId: string | null;
let peerConnection = null as RTCPeerConnection | null;
let currentRoomId: string | null;
let currentDataChannel = null as RTCDataChannel | null;
let fileSize = 0;

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
    if (typeof event.data !== "object") {
      if (JSON.parse(event.data).type === "message") {
        console.log("MESSAGE");
        const { username, message, messageId, type } = JSON.parse(event.data);
        store.dispatch(
          setCurrentCallMessages({
            your: false,
            username,
            message,
            messageId,
            type,
          })
        );

        return;
      }
      if (JSON.parse(event.data).type === "file") {
        const { username, messageId, type, fileType } = JSON.parse(event.data);

        const file = new Blob(recivedBuffers, { type: fileType });
        const url = URL.createObjectURL(file);
        console.log(file);
        console.log(url);
        recivedBuffers = [];
        store.dispatch(
          setCurrentCallMessages({
            your: false,
            username,
            url,
            messageId,
            type,
          })
        );
        return;
      }
    }

    console.log("CHUNK");
    recivedBuffers.push(event.data);
    console.log(recivedBuffers);
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
    await createPeerConection();
    store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
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
  if (store.getState().user.userCallState === callStatus.CALL_IN_PROGRESS) {
    sendCloseConnection({
      socketId: callerSocketId as string,
      currentRoomId: roomId,
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
  store.dispatch(setCalleData({}));
  handlePreOfferAnswer({
    answer: preOfferAnswerStatus.CALL_REJECTED,
    socketId: callerSocketID,
  });
};

export const handleRejectedCall = () => {
  store.dispatch(setCalleData({}));
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
  if (store.getState().user.userCallState === callStatus.CALL_IN_PROGRESS) {
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
  store.dispatch(setCalleData({}));
  store.dispatch(clearCurrentCallMessages());

  console.log("WYCZYSZCZONE");
  console.log(store.getState().webrtc.currentCallChatMessages);
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
      console.log("camera ghange");
      try {
        const selectedInputDeviceId =
          store.getState().webrtc.selectedInputDeviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: selectedInputDeviceId
            ? { deviceId: { exact: selectedInputDeviceId } }
            : true,
          video: { deviceId: { exact: deviceId } },
        });

        const videoTrack = stream.getVideoTracks()[0];

        const senders = await peerConnection?.getSenders();

        const sender = senders?.find(
          (sender) => sender.track?.kind === "video"
        );

        if (!sender) {
          toast("Failed to change camera");
          return;
        }

        await sender?.replaceTrack(videoTrack);

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
  store.dispatch(clearCurrentCallMessages());
};

export const handleSendMessage = ({
  username,
  message,
  messageId,
  type,
}: {
  username: string;
  message: string;
  messageId: string;
  type: "message";
}) => {
  const data = JSON.stringify({ username, message, messageId, type });
  currentDataChannel?.send(data);
};

export const sendFile = ({
  selectedFile,
  username,
  type,
  messageId,
}: {
  selectedFile: File;
  username: string;
  type: "file";
  messageId: string;
}) => {
  const blob = new Blob([selectedFile], { type: selectedFile.type });
  console.log(blob.size);
  const fileReader = new FileReader();
  let offset = 0;

  fileReader.onerror = (error) =>
    console.log(`Error during sending file | ${error}`);

  fileReader.onload = (e) => {
    currentDataChannel?.send(e.target!.result as ArrayBuffer);
    offset += CHUNK_SIZE;

    if (offset < blob.size) {
      readSlice(offset);
    } else {
      const data = JSON.stringify({
        username,
        messageId,
        type,
        fileType: selectedFile.type,
      });
      currentDataChannel?.send(data);
    }
  };

  const readSlice = (offset: number) => {
    const slice = blob.slice(offset, offset + CHUNK_SIZE);
    fileReader.readAsArrayBuffer(slice);
  };

  readSlice(0);
};
