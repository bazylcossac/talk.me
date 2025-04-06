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

export const handlePreOffer = (data: userDataType) => {
  if (canUserConnectiWithMe()) {
    const activeIncomingCalls = store.getState().webrtc.callingUsersData;
    const newIncomingCalls = [...activeIncomingCalls, data];
    store.dispatch(setCallStatus(callStatus.CALL_REQUESTED));
    store.dispatch(setCallingUserData(newIncomingCalls));
  } else {
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
