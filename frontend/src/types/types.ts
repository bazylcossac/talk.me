export type userDataType = {
  username: string;
  imageUrl: string;
  status: string;
  socketId: string;
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
