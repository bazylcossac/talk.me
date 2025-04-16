export type userDataType = {
  username: string;
  imageUrl: string;
  status: string;
  socketId: string;
  roomId?: string;
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

export type ActiveGroupType = {
  roomId: string;
  host: userDataType;
  users: userDataType[];
};
