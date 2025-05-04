const state = require("./state");
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");
const PORT = 3000;
const { sendingOffersFunc } = require("./sendingOffersFunc");
const app = express();
const server = http.createServer(app);
const apiRountes = require("./routes");

app.use(
  cors({
    origin: "https://talk-me-front.vercel.app",
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

const peerServer = ExpressPeerServer(server, { debug: true, path: "/peerjs" });

peerServer.on("connection", (id) => {
  console.log(`user conencted with ${id} id`);
});

app.use("/peerjs", peerServer);
app.use("/api", apiRountes);

const io = socket(server, {
  cors: {
    origin: "https://talk-me-front.vercel.app",
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
    const userIndex = state.activeUsers.findIndex(
      (user) => user.socketId === socket.id
    );

    if (user && userIndex !== -1) {
      const newUser = {
        ...user,
        status: data.activity,
      };

      state.activeUsers[userIndex] = newUser;
    }

    io.sockets.emit("activity-change", data);
  });

  socket.on("leave-call", (data) => {
    socket.leave(data.currentRoomId);
    state.roomId = "";
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
    const user = data.user;
    const activeGroupCalls = [...state.activeGroupCalls];
    const groupCall = activeGroupCalls.find(
      (group) => group.roomId === data.roomId
    );

    const groupCallIndex = activeGroupCalls.findIndex(
      (group) => group.roomId === data.roomId
    );

    const updatedGroupCall = {
      ...groupCall,
      users: [...groupCall.users, { ...data.user, peerId: data.peerId }],
    };

    activeGroupCalls[groupCallIndex] = updatedGroupCall;

    state.activeGroupCalls = activeGroupCalls;

    state.roomId = data.roomId;
    socket.to(data.roomId).emit("join-group-call-request", data);
    io.sockets.emit("group-users-change-update", {
      user: data.user,
      roomId: data.roomId,
      type: "add",
    });
  });

  socket.on("user-join-users-update", ({ users, roomId }) => {
    io.sockets.to(roomId).emit("user-join-users-update", users);
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
    const activeGroupCalls = [...state.activeGroupCalls];

    const groupCall = activeGroupCalls.find(
      (group) => group.roomId === state.roomId
    );
    if (!groupCall) return;
    const usersInGroup = groupCall.users;

    const filteredUsers = usersInGroup.filter(
      (user) => user.socketId !== socket.id
    );

    const updatedGroup = {
      ...groupCall,
      users: filteredUsers,
    };

    const groupCallIndex = activeGroupCalls.findIndex(
      (group) => group.roomId === roomId
    );

    activeGroupCalls[groupCallIndex] = updatedGroup;
    state.activeGroupCalls = activeGroupCalls;
    io.sockets.emit("active-groups", activeGroupCalls);

    socket.to(roomId).emit("leave-group-call", { socketId, roomId });
    state.roomId = "";
  });

  socket.on("group-users-change-update", ({ user, roomId, type }) => {
    io.sockets.emit("group-users-change-update", {
      user,
      roomId,
      type,
    });
  });

  socket.on("kick-user-request", (socketId) => {
    socket.to(socketId).emit("kick-me", { socketId, roomId: state.roomId });
    socket
      .to(state.roomId)
      .emit("leave-group-call", { socketId, roomId: state.roomId });
  });

  socket.on("disconnect", () => {
    const activeUsers = [...state.activeUsers];
    const activeGroupCalls = [...state.activeGroupCalls];

    const usersLeft = activeUsers.filter((user) => user.socketId !== socket.id);
    const hostingGroupCall = activeGroupCalls.find(
      (group) => group.socketId === socket.id
    );
    const groupCall = activeGroupCalls.find(
      (group) => group.roomId === state.roomId
    );

    // delete from users array

    if (hostingGroupCall) {
      const filteredGroups = activeGroupCalls.filter(
        (group) => group.socketId !== hostingGroupCall.socketId
      );
      state.activeGroupCalls = filteredGroups;

      io.sockets
        .to(hostingGroupCall.roomId)
        .emit("close-group-call-gone", hostingGroupCall.roomId);
      // sprawdzic czy potrzeba index dodawac index grupy
      io.sockets.emit("active-groups", filteredGroups);
    }

    if (groupCall) {
      const usersInGroup = groupCall.users;

      const filteredUsers = usersInGroup.filter(
        (user) => user.socketId !== socket.id
      );

      const updatedGroup = {
        ...groupCall,
        users: filteredUsers,
      };

      const groupCallIndex = activeGroupCalls.findIndex(
        (group) => group.roomId === state.roomId
      );

      activeGroupCalls[groupCallIndex] = updatedGroup;
      state.activeGroupCalls = activeGroupCalls;
      io.sockets.emit("active-groups", activeGroupCalls);
    }

    state.activeUsers = usersLeft;
    io.sockets.emit("user-disconnected", usersLeft);
    socket.to(state.roomId).emit("group-call-user-disconnect", {
      roomId: state.roomId,
      socketId: socket.id,
    });

    socket.leave(state.roomId);
    state.roomId = "";
  });
});

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
