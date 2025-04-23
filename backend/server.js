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
const { sendingOffersFunc } = require("./sendingOffersFunc");
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, { debug: true });

peerServer.on("connection", (id) => {
  console.log(`user conencted with ${id} id`);
});

app.use("/peerjs", peerServer);
app.use(express.json());
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

app.post("/api/verifyPassword", (req, res) => {
  const { password, roomId } = req.body;

  const room = activeGroupCalls.find((group) => group.roomId === roomId);
  if (!room) {
    res.json({ verified: false });
  }

  if (room.groupPassword === password) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

app.post("/api/isCallPossible", (req, res) => {
  const { roomId } = req.body;

  const room = activeGroupCalls.find((group) => group.roomId === roomId);

  if (room.users.length + 1 >= 4) {
    res.json({ possible: false });
  } else {
    res.json({ possible: true });
  }
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
    io.sockets.emit("user-join", { activeUsers, activeGroupCalls });
  });

  // socket.on("send-pre-offer", (data) => {
  //   const newRoomId = uuid.v4();
  //   roomId = newRoomId;
  //   socket.join(roomId);

  //   socket
  //     .to(data.calleSocketId)
  //     .emit("send-pre-offer", { caller: data.caller, roomId });
  // });

  // socket.on("pre-offer-answer", ({ answer, callerSocketId }) => {
  //   socket
  //     .to(callerSocketId)
  //     .emit("pre-offer-answer", { answer, socketId: socket.id });
  // });

  // socket.on("send-offer", (data) => {
  //   socket.join(data.roomId);
  //   roomId = data.roomId;

  //   socket
  //     .to(data.calleSocketId)
  //     .emit("send-offer", { offer: data.offer, socketId: socket.id, roomId });
  // });

  // socket.on("send-offer-answer", (data) => {
  //   socket.to(data.socketId).emit("send-offer-answer", data);
  // });

  // socket.on("send-candidate", (data) => {
  //   socket.to(data.socketId).emit("send-candidate", data.candidate);
  // });
  sendingOffersFunc(socket);

  socket.on("activity-change", (data) => {
    const user = activeUsers.find((user) => user.socketId === socket.id);

    if (user) {
      const newUser = {
        ...user,
        status: data.activity,
      };

      const usersLeft = activeUsers.filter(
        (user) => user.socketId !== socket.id
      );

      const newUsers = [...usersLeft, newUser];
      activeUsers = newUsers;
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
    // remove user from roomId via SOCKET ID
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
    activeGroupCalls.push(newGroupCall);

    io.sockets.emit("active-groups", activeGroupCalls);
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
    const newGroups = activeGroupCalls.filter(
      (group) => group.roomId !== roomId
    );
    activeGroupCalls = newGroups;
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
    console.log("roomid");
    console.log(roomId);
    console.log(socket.id);
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
