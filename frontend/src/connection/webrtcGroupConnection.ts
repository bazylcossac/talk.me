import Peer from "peerjs";
import { sendRequestOpenGroupCall } from "./webSocketConnection";

let peerId: string;
let peer;

export const createGroupPeerConnection = () => {
  peer = new Peer({
    host: "localhost",
    port: 3000,
    path: "/peerjs",
  });

  peer.on("open", (id) => {
    console.log("PEER JS USER ", id);
    peerId = id;
  });
};

export const createGroupCall = () => {
  createGroupPeerConnection();
  sendRequestOpenGroupCall(peerId);
};
