import { userStatus } from "@/lib/constants";

export type userDataType = {
  username: string;
  imageUrl: string;
  status: string;
  socketId?: string;
  roomId?: string;
};

export type groupCallUserDataType = {
  streamId: string;
  user: {
    username: string;
    socketId: string;
    imageUrl: string;
    status: (typeof userStatus)[keyof typeof userStatus];
  };
  roomId: string;
  peerId: string;
};

export type GroupCallDataType = {
  peerId: string;
  roomId: string;
  socketId: string;
  hostUser: userDataType;
  users: {
    username: string;
    imageUrl: string;
    status: (typeof userStatus)[keyof typeof userStatus];
    socketId: string
  }[];
};

export type preOfferDataType = {
  caller: userDataType;
  calleSocketId: string;
};

export type chatMessageType = {
  username: string;
  message: string;
  your: boolean;
  messageId: string;
  type: "message";
};
export type chatFileType = {
  username: string;
  url: string;
  your: boolean;
  fileType: string;
  messageId: string;
  type: "file";
};

export type chatItemType = chatMessageType | chatFileType;
