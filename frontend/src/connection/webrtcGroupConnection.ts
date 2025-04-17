import Peer from "peerjs";

const peer = new Peer({
  host: "localhost",
  port: 3000,
  path: "/peerjs",
});

peer.on("open", (id) => {
  console.log("PEER JS USER ", id);
});



