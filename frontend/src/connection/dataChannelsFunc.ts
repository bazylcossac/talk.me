import { CHUNK_SIZE } from "@/lib/constants";
import { currentDataChannel } from "./webrtcConnection";

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
  const data = JSON.stringify({ username, message, messageId, type });
  currentDataChannel?.send(data);
};

export const sendFile = ({
  selectedFile,
  username,
  type,
  messageId,
}: {
  selectedFile: File;
  username: string;
  type: "file";
  messageId: string;
}) => {
  const blob = new Blob([selectedFile], { type: selectedFile.type });
  
  const fileReader = new FileReader();
  let offset = 0;

  fileReader.onerror = (error) =>
    console.log(`Error during sending file | ${error}`);

  fileReader.onload = (e) => {
    currentDataChannel?.send(e.target!.result as ArrayBuffer);
    offset += CHUNK_SIZE;

    if (offset < blob.size) {
      readSlice(offset);
    } else {
      const data = JSON.stringify({
        username,
        messageId,
        type,
        fileType: selectedFile.type,
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
