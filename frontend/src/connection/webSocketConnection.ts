import { io, Socket } from "socket.io-client";
import { userDataType } from "../types/types";
let socket: Socket;
let mySocketId: string;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socketId) => {
    mySocketId = socketId;
    console.log(mySocketId);
  });
  //   socket.on("user-join", (data) => {
  //     console.log(data);
  //   });
};

export const handleUserJoin = (userData: userDataType) => {
  socket.emit("user-join", { ...userData, mySocketId });
};
