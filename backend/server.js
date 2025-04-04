const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const { PrismaClient, Prisma } = require("@prisma/client");
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

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);
  socket.emit("connection", socket.id);

  socket.on("user-join", (data) => {
    console.log(data);
  });


  socket.on("disconnect", () => {
    io.sockets.emit("user-left", socket.id)
  })
});

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});
