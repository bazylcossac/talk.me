const state = require("./state");
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const axios = require("axios");
const { ExpressPeerServer } = require("peer");
const { PrismaClient, Prisma } = require("@prisma/client");
const cors = require("cors");
const PORT = 3000;
const { sendingOffersFunc } = require("./sendingOffersFunc");
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const apiRountes = require("./routes");

const peerServer = ExpressPeerServer(server, { debug: true });

peerServer.on("connection", (id) => {
  console.log(`user conencted with ${id} id`);
});

app.use("/peerjs", peerServer);
app.use("/api", apiRountes);
app.use(express.json());
app.use(cors());

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let roomId;

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.emit("connection", socket.id);

  socket.on("user-join", (data) => {
    state.activeUsers.push(data);
    io.sockets.emit("user-join", {
      activeUsers: state.activeUsers,
      activeGroupCalls: state.activeGroupCalls,
    });
  });

  // sending offers ( pre offers, offers, ice candidates)
  sendingOffersFunc(socket);

  socket.on("activity-change", (data) => {
    const user = state.activeUsers.find((user) => user.socketId === socket.id);

    if (user) {
      const newUser = {
        ...user,
        status: data.activity,
      };

      const usersLeft = state.activeUsers.filter(
        (user) => user.socketId !== socket.id
      );

      const newUsers = [...usersLeft, newUser];
      state.activeUsers = newUsers;
    }

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

  socket.on("create-group-call", (data) => {
    socket.join(data.roomId);
    const newGroupCall = {
      peerId: data.peerId,
      roomId: data.roomId,
      hostUser: data.user,
      socketId: data.mySocketId,
      groupName: data.groupName,
      groupPassword: data.groupPassword,
      users: [],
    };
    state.activeGroupCalls.push(newGroupCall);
    console.log(state.activeGroupCalls);

    io.sockets.emit("active-groups", state.activeGroupCalls);
  });

  socket.on("join-group-call-request", (data) => {
    socket.join(data.roomId);
    roomId = data.roomId;
    socket.to(data.roomId).emit("join-group-call-request", data);
    io.sockets.emit("group-users-change-update", {
      user: data.user,
      roomId: data.roomId,
      type: "add",
    });
  });

  socket.on("user-join-users-update", ({ users, roomId }) => {
    socket.to(roomId).emit("user-join-users-update", users);
  });

  socket.on("close-group-call-by-host", (roomId) => {
    const newGroups = state.activeGroupCalls.filter(
      (group) => group.roomId !== roomId
    );
    state.activeGroupCalls = newGroups;
    socket.to(roomId).emit("close-group-call-by-host", roomId);
    io.sockets.emit("remove-group-call", newGroups);
  });

  socket.on("leave-group-call", ({ socketId, roomId }) => {
    socket.to(roomId).emit("leave-group-call", { socketId, roomId });
  });

  socket.on("group-users-change-update", ({ user, roomId, type }) => {
    io.sockets.emit("group-users-change-update", {
      user,
      roomId,
      type,
    });
  });

  socket.on("disconnect", () => {
    const usersLeft = state.activeUsers.filter(
      (user) => user.socketId !== socket.id
    );
    const hostingGroupCall = state.activeGroupCalls.find(
      (group) => group.socketId === socket.id
    );
    if (!!hostingGroupCall) {
      const filteredGroups = state.activeGroupCalls.filter(
        (group) => group.socketId !== hostingGroupCall.socketId
      );
      state.activeGroupCalls = filteredGroups;
      io.sockets
        .to(hostingGroupCall.roomId)
        .emit("close-group-call-gone", hostingGroupCall.roomId);
      io.sockets.emit("active-groups", filteredGroups);
    }

    state.activeUsers = usersLeft;
    io.sockets.emit("user-disconnected", usersLeft);
    socket
      .to(roomId)
      .emit("group-call-user-disconnect", { roomId, socketId: socket.id });

    socket.leave(roomId);
    roomId = "";
  });
});

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
