import { CHUNK_SIZE } from "@/lib/constants";
import { currentDataChannel } from "./webrtcConnection";
import { dataChannelGroup } from "./webrtcGroupConnection";
import store from "../store/store";

export const handleSendMessage = ({
  username,
  message,
  messageId,
  type,
}: {
  username: string;
  message: string;
  messageId: string;
  type: "message";
}) => {
  const isInGropCall = store.getState().user.isInGroupCall;
  const data = JSON.stringify({ username, message, messageId, type });
  if (isInGropCall) {
    dataChannelGroup?.send(data);
  } else {
    currentDataChannel?.send(data);
  }
};

export const sendFile = ({
  file,
  username,
  type,
  messageId,
}: {
  file: File;
  username: string;
  type: "file";
  messageId: string;
}) => {
  const blob = new Blob([file], { type: file.type });
  const isInGropCall = store.getState().user.isInGroupCall;
  const fileReader = new FileReader();
  let offset = 0;

  fileReader.onerror = (error) =>
    console.log(`Error during sending file | ${error}`);

  fileReader.onload = (e) => {
    if (isInGropCall) {
      dataChannelGroup?.send(e.target!.result as ArrayBuffer);
    } else {
      currentDataChannel?.send(e.target!.result as ArrayBuffer);
    }
    offset += CHUNK_SIZE;

    if (offset < blob.size) {
      readSlice(offset);
    } else {
      const data = JSON.stringify({
        username,
        messageId,
        type,
        fileType: file.type,
      });
      currentDataChannel?.send(data);
    }
  };

  const readSlice = (offset: number) => {
    const slice = blob.slice(offset, offset + CHUNK_SIZE);
    fileReader.readAsArrayBuffer(slice);
  };

  readSlice(0);
};
