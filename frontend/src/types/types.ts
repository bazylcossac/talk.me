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

export type chatMessage = {
  socketId: string;
  username: string;
  message: string;
};

export type ActiveGroupType = {
  roomId: string;
  host: userDataType;
  users: userDataType[];
};
