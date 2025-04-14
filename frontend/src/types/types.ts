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
};

export type ActiveGroupType = {
  roomId: string;
  host: userDataType;
  users: userDataType[];
};
