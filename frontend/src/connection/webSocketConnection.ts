import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socket) => {
    console.log(socket);
  });
};
