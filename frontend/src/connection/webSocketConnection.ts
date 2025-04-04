import { io, Socket } from "socket.io-client";
import { userDataType } from "../types/types";
import store from "@/store/store";
import { setActiveUsers } from "@/store/slices/user";

let socket: Socket;
let mySocketId: string;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socketId) => {
    mySocketId = socketId;
    console.log(mySocketId);
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
};

export const userJoin = (userData: userDataType) => {
  socket.emit("user-join", { ...userData, socketId: mySocketId });
};

export const handleUserJoin = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};

export const handleUserDisconnect = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};
