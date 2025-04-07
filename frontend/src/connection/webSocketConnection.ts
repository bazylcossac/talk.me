import { io, Socket } from "socket.io-client";
import { preOfferDataType, userDataType } from "../types/types";
import store from "@/store/store";
import {
  setActiveUsers,
  setCallStatus,
  setCurrentlyLoggedUser,
  setUserActiveStatus,
} from "@/store/slices/user";
import { handlePreOffer } from "./webrtcConnection";
import { callStatus, preOfferAnswerStatus, userStatus } from "@/lib/constants";
import { toast } from "sonner";

let socket: Socket;
let mySocketId: string;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socketId) => {
    mySocketId = socketId;
  });

  socket.on("user-join", (activeUsers) => {
    const activeUsersButMe = activeUsers.filter(
      (user: userDataType) => user.socketId !== mySocketId
    );

    handleUserJoin(activeUsersButMe);
  });

  socket.on("user-disconnected", (activeUsers) => {
    const activeUsersButMe = activeUsers.filter(
      (user: userDataType) => user.socketId !== mySocketId
    );
    handleUserDisconnect(activeUsersButMe);
  });

  socket.on("send-pre-offer", (data) => {
    handlePreOffer(data);
  });
  socket.on("pre-offer-answer", (data) => {
    handlePreOfferAnswer(data);
  });

  socket.on(
    "activity-change",
    ({
      user,
      activity,
    }: {
      user: userDataType;
      activity: (typeof userStatus)[keyof typeof userStatus];
    }) => {
      const acttiveUsers = store.getState().user.activeUsers;
      const newUsers = acttiveUsers.filter(
        (activeUser) => activeUser.socketId !== user.socketId
      );
      const newActiveUsers = [
        ...newUsers,
        {
          ...user,
          status: activity,
        },
      ];

      store.dispatch(setActiveUsers(newActiveUsers));
    }
  );
};

// user join - disconnect

export const userJoin = (userData: Omit<userDataType, "socketId">) => {
  socket.emit("user-join", { ...userData, socketId: mySocketId });
  store.dispatch(setCurrentlyLoggedUser({ ...userData, socketId: mySocketId }));
};

export const handleUserJoin = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};

export const handleUserDisconnect = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};

// user call pre offer

// caller - my socket id
// calee - user that i want to connect with

export const handleSendPreOffer = (data: preOfferDataType) => {
  socket.emit("send-pre-offer", {
    caller: data.caller,
    calleSocketId: data.calleSocketId,
  });
};

export const sendPreOfferAnswer = ({
  answer,
  callerSocketId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  callerSocketId: string;
}) => {
  socket.emit("pre-offer-answer", { answer: answer, callerSocketId });
};

export const handlePreOfferAnswer = ({
  answer,
  callerSocketId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  callerSocketId: string;
}) => {
  if(answer === preOfferAnswerStatus.CALL_ACCEPTED){
    // send offer
  }
  else{
    // handle rejection
  }
};

export const handleUserActiveChange = (
  newActivity: (typeof userStatus)[keyof typeof userStatus]
) => {
  const currentUser = store.getState().user.loggedUser;

  socket.emit("activity-change", {
    user: currentUser,
    activity: newActivity,
  });
  store.dispatch(setUserActiveStatus(newActivity));
};
