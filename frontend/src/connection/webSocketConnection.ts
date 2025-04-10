import { io, Socket } from "socket.io-client";
import { preOfferDataType, userDataType } from "../types/types";
import store from "@/store/store";
import {
  setActiveUsers,
  setCurrentlyLoggedUser,
  setUserActiveStatus,
} from "@/store/slices/user";
import {
  clearAfterClosingConnection,
  handleCandidate,
  handleOffer,
  handleOfferAnswer,
  handleOtherUserLeaveCall,
  handlePreOffer,
  handlePreOfferAnswer,
  handleRejectedCall,
} from "./webrtcConnection";
import { preOfferAnswerStatus, userStatus } from "@/lib/constants";
import { toast } from "sonner";

let socket: Socket;
let mySocketId: string;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socketId) => {
    mySocketId = socketId;
    console.log(socketId);
  });

  socket.on("user-join", (activeUsers) => {
    const activeUsersButMe = activeUsers.filter(
      (user: userDataType) => user.socketId !== mySocketId
    );

    handleUserJoin(activeUsersButMe);
  });

  socket.on("user-disconnected", (activeUsers) => {
    const activeUsersButMe = activeUsers.filter(
      (user: userDataType) => user.socketId !== mySocketId
    );
    handleUserDisconnect(activeUsersButMe);
  });

  socket.on("send-pre-offer", (data) => {
    handlePreOffer(data);
  });
  socket.on("pre-offer-answer", (data) => {
    handlePreOfferAnswer(data);
  });

  socket.on("send-offer", (data) => {
    handleOffer(data);
  });

  socket.on("send-offer-answer", (data) => {
    handleOfferAnswer(data);
  });

  socket.on("send-candidate", (candidate) => {
    handleCandidate(candidate);
  });

  socket.on(
    "activity-change",
    ({
      user,
      activity,
    }: {
      user: userDataType;
      activity: (typeof userStatus)[keyof typeof userStatus];
    }) => {
      const acttiveUsers = store.getState().user.activeUsers;
      const newUsers = acttiveUsers.filter(
        (activeUser) => activeUser.socketId !== user.socketId
      );
      const newActiveUsers = [
        ...newUsers,
        {
          ...user,
          status: activity,
        },
      ];

      store.dispatch(setActiveUsers(newActiveUsers));
    }
  );

  socket.on("leave-call", () => {
    handleOtherUserLeaveCall();
  });

  socket.on("rejected-call", () => {
    handleRejectedCall();
  });

  socket.on("close-call-user-gone", (roomId) => {
    toast("User left");
    clearAfterClosingConnection();
    socket.emit("disconnect-from-room", roomId);
  });
};

// user join - disconnect

export const userJoin = (userData: Omit<userDataType, "socketId">) => {
  socket.emit("user-join", { ...userData, socketId: mySocketId });
  store.dispatch(setCurrentlyLoggedUser({ ...userData, socketId: mySocketId }));
};

export const handleUserJoin = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};

export const handleUserDisconnect = (activeUsers: userDataType[]) => {
  store.dispatch(setActiveUsers(activeUsers));
};

// user call pre offer

// caller - my socket id
// calee - user that i want to connect with

export const handleSendPreOffer = (data: preOfferDataType) => {
  socket.emit("send-pre-offer", {
    caller: data.caller,
    calleSocketId: data.calleSocketId,
  });
};

export const sendPreOfferAnswer = ({
  answer,
  callerSocketId,
  roomId,
}: {
  answer: (typeof preOfferAnswerStatus)[keyof typeof preOfferAnswerStatus];
  callerSocketId: string;
  roomId?: string;
}) => {
  socket.emit("pre-offer-answer", { answer: answer, callerSocketId, roomId });
};

export const handleUserActiveChange = (
  newActivity: (typeof userStatus)[keyof typeof userStatus]
) => {
  const currentUser = store.getState().user.loggedUser;

  socket.emit("activity-change", {
    user: currentUser,
    activity: newActivity,
  });
  store.dispatch(setUserActiveStatus(newActivity));
};

export const handleSendOffer = ({
  offer,
  calleSocketId,
  roomId,
}: {
  offer: RTCSessionDescriptionInit;
  calleSocketId: string;
  roomId: string;
}) => {
  socket.emit("send-offer", {
    offer,
    calleSocketId,
    roomId,
  });
};

export const sendOfferAnswer = ({
  answer,
  socketId,
}: {
  answer: RTCSessionDescriptionInit;
  socketId: string;
}) => {
  socket.emit("send-offer-answer", { answer, socketId });
};

export const sendIceCandidate = ({
  candidate,
  socketId,
}: {
  candidate: RTCIceCandidate;
  socketId: string;
}) => {
  socket.emit("send-candidate", { candidate, socketId });
};

export const sendCloseConnection = ({
  socketId,
  currentRoomId,
}: {
  socketId: string;
  currentRoomId: string;
}) => {
  socket.emit("leave-call", {socketId, currentRoomId});
};

export const sendRejectAnswer = ({ socketId }: { socketId: string }) => {
  socket.emit("rejected-call", socketId);
};

export const handleDisconnectFromRoom = (roomId: string) => {
  socket.emit("disconnect-from-room", roomId);
};
