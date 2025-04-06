import { io, Socket } from "socket.io-client";
import { preOfferDataType, userDataType } from "../types/types";
import store from "@/store/store";
import { setActiveUsers, setCurrentlyLoggedUser } from "@/store/slices/user";
import { handlePreOffer } from "./webrtcConnection";
import { preOfferAnswerStatus } from "@/lib/constants";

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
    console.log(data);
  });
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

export const handlePreOfferAnswer = ({
  answer,
  callerSocketId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  callerSocketId: string;
}) => {
  socket.emit("pre-offer-answer", { answer, callerSocketId });
};
