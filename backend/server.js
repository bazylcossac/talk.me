const dotenv = require("dotenv").config();
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const axios = require("axios");
const { ExpressPeerServer } = require("peer");
const { PrismaClient, Prisma } = require("@prisma/client");
const uuid = require("uuid");
const cors = require("cors");
const PORT = 3000;

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, { debug: true });

peerServer.on("connection", (id) => {
  console.log(`user conencted with ${id} id`);
});

console.log(dotenv.parsed.API_TURN_URL);

app.use("/peerjs", peerServer);
app.use(cors());

app.post("/api/getTURNCredentials", async (req, res) => {
  const ttl = 86400;
  const response = await axios.post(
    dotenv.parsed.API_TURN_URL,
    { ttl },
    {
      headers: {
        Authorization: `Bearer ${dotenv.parsed.API_TURN_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const { data } = response;
  res.json(data);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let activeUsers = [];
let activeGroupCalls = [];
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
      .emit("send-offer", { offer: data.offer, socketId: socket.id, roomId });
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

  socket.on("leave-call", (data) => {
    socket.leave(data.currentRoomId);
    roomId = "";
    socket.to(data.socketId).emit("leave-call");
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
    const hostingGroupCall = activeGroupCalls.find(
      (group) => group.socketId === socket.id
    );
    if (!!hostingGroupCall) {
      const filteredGroups = activeGroupCalls.filter(
        (group) => group.socketId !== hostingGroupCall.socketId
      );
      activeGroupCalls = filteredGroups;
      io.sockets
        .to(hostingGroupCall.roomId)
        .emit("close-group-call-gone", hostingGroupCall.roomId);
      io.sockets.emit("active-groups", filteredGroups);
    }

    activeUsers = usersLeft;
    io.sockets.emit("user-disconnected", usersLeft);
    io.sockets.to(roomId).emit("close-call-user-gone", roomId);
    roomId = "";
  });

  socket.on("create-group-call", (data) => {
    socket.join(data.roomId);
    const newGroupCall = {
      peerId: data.peerId,
      roomId: data.roomId,
      hostUser: data.user,
      socketId: data.mySocketId,
      users: [],
    };
    activeGroupCalls.push(newGroupCall);

    io.sockets.emit("active-groups", activeGroupCalls);
  });
});

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
