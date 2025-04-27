import { sendFile } from "@/connection/dataChannelsFunc";
import { setCurrentCallMessages } from "@/store/slices/webrtc";
import store from "@/store/store";
import { UserResource } from "@clerk/types";

export async function sendMessageDataChannels(file: File, user: UserResource) {
  const messageId = crypto.randomUUID();
  sendFile({
    file,
    username: (user.username as string) || (user.fullName as string),
    type: "file",
    messageId,
  });
  const url = URL.createObjectURL(file);
  store.dispatch(
    setCurrentCallMessages({
      type: "file",
      your: true,
      username: user?.username || user?.fullName,
      url: url,
      messageId,
      fileType: file.type,
    })
  );
}
