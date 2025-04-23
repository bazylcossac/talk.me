const uuid = require("uuid");
function sendingOffersFunc(socket) {
  socket.on("send-pre-offer", (data) => {
    const newRoomId = uuid.v4();
    roomId = newRoomId;
    socket.join(roomId);
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
}

module.exports = { sendingOffersFunc };
