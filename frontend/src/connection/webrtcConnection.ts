import { callStatus, preOfferAnswerStatus, userStatus } from "@/lib/constants";
import { setCallStatus } from "@/store/slices/user";
import store from "@/store/store";
import {
  handlePreOfferAnswer,
  handleSendPreOffer,
} from "./webSocketConnection";
import { setCallingUserData } from "@/store/slices/webrtc";
import { userDataType } from "@/types/types";

let callerSocketId;

export const callToUser = (calleSocketId: string) => {
  callerSocketId = calleSocketId; // setting userSocketId to calleSocketId, which is socket id that we want to connect with
  const currentUser = store.getState().user.loggedUser;
  handleSendPreOffer({
    caller: currentUser,
    calleSocketId: calleSocketId,
  });

  store.dispatch(setCallStatus(callStatus.CALL_IN_PROGRESS));
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
  } else {
    // sends info to caller that call is not possible
    handlePreOfferAnswer({
      answer: preOfferAnswerStatus.CALL_UNVAILABLE,
      callerSocketId: data.socketId,
    });
  }
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
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketId
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  console.log("CALL ACCEPTED");
  /// send accept data to caller
};

export const handleRejectCall = ({
  callerSocketId,
}: {
  callerSocketId: string;
}) => {
  store.dispatch(setCallStatus(callStatus.CALL_AVAILABLE));
  const currentIncomingCalls = store.getState().webrtc.callingUsersData;
  const filteredIncomingCalls = currentIncomingCalls.filter(
    (user) => user.socketId !== callerSocketId
  );
  store.dispatch(setCallingUserData(filteredIncomingCalls));
  // send reject data to caller
};

export const handleStatusChange = () => {
    
}

