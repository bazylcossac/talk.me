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
  socketId: string;
  username: string;
  message: string;
  your: boolean;
};

export type ActiveGroupType = {
  roomId: string;
  host: userDataType;
  users: userDataType[];
};
