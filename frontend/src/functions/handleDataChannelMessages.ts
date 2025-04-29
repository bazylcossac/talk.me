import store from "../store/store";
import { setCurrentCallMessages } from "@/store/slices/webrtc";

let recivedBuffers = [] as ArrayBuffer[];

export default function handleDataChannelMessages(data: unknown) {
  if (typeof data !== "object") {
    if (JSON.parse(data as string).type === "message") {
      const { username, message, messageId, type } = JSON.parse(data as string);
      store.dispatch(
        setCurrentCallMessages({
          your: false,
          username,
          message,
          messageId,
          type,
        })
      );

      return;
    }
    if (JSON.parse(data as string).type === "file") {
      const { username, messageId, type, fileType } = JSON.parse(
        data as string
      );

      const file = new Blob(recivedBuffers, { type: fileType });
      const url = URL.createObjectURL(file);
      recivedBuffers = [];
      store.dispatch(
        setCurrentCallMessages({
          your: false,
          username,
          url,
          messageId,
          type,
          fileType,
        })
      );
      return;
    }
  }

  recivedBuffers.push(data as ArrayBuffer);
}
