const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const { PrismaClient, Prisma } = require("@prisma/client");
const uuid = require("uuid");
const PORT = 3000;

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, { debug: true });
peerServer.on("connection", (id) => {
  console.log(`user conencted with ${id} id`);
});

app.use("/peerjs", peerServer);

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let activeUsers = [];
let roomId;

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.emit("connection", socket.id);

  socket.on("user-join", (data) => {
    activeUsers.push(data);
    io.sockets.emit("user-join", activeUsers);
  });

  socket.on("send-pre-offer", (data) => {
    const newRoomId = uuid.v4();
    roomId = newRoomId;
    socket.join(roomId);
    console.log(`${socket.id} is connected to ${roomId}`);
    socket
      .to(data.calleSocketId)
      .emit("send-pre-offer", { caller: data.caller, roomId });
  });

  socket.on("pre-offer-answer", ({ answer, callerSocketId }) => {
    socket
      .to(callerSocketId)
      .emit("pre-offer-answer", { answer, socketId: socket.id });
  });

  socket.on("send-offer", (data) => {
    socket.join(data.roomId);
    roomId = data.roomId;
    console.log(`${socket.id} is connected to ${roomId}`);
    socket
      .to(data.calleSocketId)
      .emit("send-offer", { offer: data.offer, socketId: socket.id });
  });

  socket.on("send-offer-answer", (data) => {
    socket.to(data.socketId).emit("send-offer-answer", data);
  });

  socket.on("send-candidate", (data) => {
    socket.to(data.socketId).emit("send-candidate", data.candidate);
  });

  socket.on("activity-change", (data) => {
    io.sockets.emit("activity-change", data);
  });

  socket.on("leave-call", (socketId) => {
    socket.to(socketId).emit("leave-call");
  });

  socket.on("rejected-call", (socketId) => {
    socket.to(socketId).emit("rejected-call");
  });

  socket.on("disconnect-from-room", (roomID) => {
    socket.leave(roomID);
    roomId = "";
  });

  socket.on("disconnect", () => {
    const usersLeft = activeUsers.filter((user) => user.socketId !== socket.id);

    activeUsers = usersLeft;
    io.sockets.emit("user-disconnected", usersLeft);
    io.sockets.to(roomId).emit("close-call-user-gone", roomId);
    roomId = "";
  });
});

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
