const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const { PrismaClient, Prisma } = require("@prisma/client");
const PORT = 3000;

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("server running on port ", PORT);
});

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
