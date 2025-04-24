import { io, Socket } from "socket.io-client";
import {
  GroupCallDataType,
  groupCallUserDataType,
  preOfferDataType,
  userDataType,
} from "../types/types";
import store from "@/store/store";
import {
  setActiveGroups,
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
import {
  connectToGroupCall,
  handleDisconnectFromGroupCall,
  handleDisconnectMeFromGroupCall,
  handleUserGroupCallDisconnect,
} from "./webrtcGroupConnection";
import { setGroupCallUsers, setNewGroupCallUsers } from "@/store/slices/webrtc";

let socket: Socket;
let mySocketId: string;

export const connectToWebSocket = () => {
  socket = io("http://localhost:3000");

  socket.on("connection", (socketId) => {
    mySocketId = socketId;
    console.log(socketId);
  });

  socket.on("user-join", ({ activeUsers, activeGroupCalls }) => {
    const activeUsersButMe = activeUsers.filter(
      (user: userDataType) => user.socketId !== mySocketId
    );

    handleUserJoin(activeUsersButMe, activeGroupCalls);
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
      const activeUsers = store.getState().user.activeUsers;

      const tempUseres = [...activeUsers];

      const userIndex = tempUseres.findIndex(
        (activeUser) => activeUser.socketId === user.socketId
      );

      const newUser = {
        ...user,
        status: activity,
      };

      tempUseres[userIndex] = newUser;

      store.dispatch(setActiveUsers(tempUseres));
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
    console.log("user left");
    clearAfterClosingConnection();
    socket.emit("disconnect-from-room", roomId);
  });

  // group calls

  socket.on("active-groups", (activeGroupCalls) => {
    const filteredActiveGroups = activeGroupCalls.filter(
      (group: GroupCallDataType) => group.socketId !== mySocketId
    );
    store.dispatch(setActiveGroups(filteredActiveGroups));
  });

  socket.on("close-group-call-gone", (roomId) => {
    handleDisconnectFromGroupCall(roomId);
    toast("Host left");
    // handle removing steram from current group call
    // leaveGroupCall()
  });

  socket.on(
    "group-call-user-disconnect",
    ({ roomId, socketId }: { roomId: string; socketId: string }) => {
      handleUserGroupCallDisconnect(socketId, roomId);
    }
  );

  socket.on("join-group-call-request", (data) => {
    console.log("JOIN REQUEST");
    console.log(data);
    store.dispatch(setGroupCallUsers(data));
    const users = store.getState().webrtc.groupCallUsers;
    connectToGroupCall(data);
    socket.emit("user-join-users-update", { users, roomId: data.roomId });
  });

  socket.on("group-users-change-update", ({ user, roomId, type }) => {
    const groups = store.getState().user.activeGroups;
    const group = groups.find((group) => group.roomId === roomId);
    switch (type) {
      case "add": {
        if (!group) {
          /// do some logic when user try to join group that does not exist
          return;
        }
        const updatedUsersGroup = {
          ...group,
          users: [...group!.users, user],
        };

        const filteredGroups = groups.filter(
          (activeGroup) => activeGroup.roomId !== group.roomId
        );
        const newGroups = [...filteredGroups, updatedUsersGroup];
        store.dispatch(setActiveGroups(newGroups));
        break;
      }
      case "remove": {
        console.log(user);
        // remove user
        if (!group) {
          /// do some logic when user try to join group that does not exist
          return;
        }
        const filteredUsers = group.users.filter(
          (groupUser) => groupUser.socketId !== user.user.socketId
        );

        const updatedUsersGroup = {
          ...group,
          users: [...filteredUsers],
        };

        console.log("UPPDATES USERS");
        console.log(updatedUsersGroup);
        const filteredGroups = groups.filter(
          (activeGroup) => activeGroup.roomId !== group.roomId
        );
        const newGroups = [...filteredGroups, updatedUsersGroup];
        store.dispatch(setActiveGroups(newGroups));
      }
    }
  });

  socket.on("user-join-users-update", (users) => {
    console.log("USERS");
    console.log(users);
    store.dispatch(setNewGroupCallUsers(users));
  });

  socket.on("close-group-call-by-host", (roomId: string) => {
    handleDisconnectMeFromGroupCall(roomId);
    toast("Group call closed by host");
  });

  socket.on("remove-group-call", (newGroups) => {
    store.dispatch(setActiveGroups(newGroups));
  });

  socket.on(
    "leave-group-call",
    ({ socketId, roomId }: { socketId: string; roomId: string }) => {
      handleUserGroupCallDisconnect(socketId, roomId);
    }
  );

  socket.on(
    "kick-me",
    ({ socketId, roomId }: { socketId: string; roomId: string }) => {
      sendLeaveGroupCallRequest({ socketId, roomId });
      handleDisconnectFromGroupCall(roomId);
    }
  );
};

// user join - disconnect

export const userJoin = (userData: Omit<userDataType, "socketId">) => {
  socket.emit("user-join", { ...userData, socketId: mySocketId });
  store.dispatch(setCurrentlyLoggedUser({ ...userData, socketId: mySocketId }));
};

export const handleUserJoin = (
  activeUsers: userDataType[],
  activeGroupCalls: GroupCallDataType[]
) => {
  store.dispatch(setActiveUsers(activeUsers));
  store.dispatch(setActiveGroups(activeGroupCalls));
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

// sending offer / ice-candidates

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

// closing / disconnecting

export const sendCloseConnection = ({
  socketId,
  currentRoomId,
}: {
  socketId: string;
  currentRoomId: string;
}) => {
  socket.emit("leave-call", { socketId, currentRoomId });
};
export const handleDisconnectFromRoom = (roomId: string) => {
  socket.emit("disconnect-from-room", roomId);
};

export const sendRejectAnswer = ({ socketId }: { socketId: string }) => {
  socket.emit("rejected-call", socketId);
};

// activity

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

// export const createGroupCall

export const sendRequestOpenGroupCall = (
  peerId: string,
  roomId: string,
  groupName: string,
  groupPassword: string | null
) => {
  const user = store.getState().user.loggedUser;

  const data = {
    peerId,
    user,
    mySocketId,
    roomId,
    groupName,
    groupPassword,
  };
  socket.emit("create-group-call", data);
};

export const sendJoinRequest = (data: {
  streamId: string;
  user: userDataType;
  roomId: string;
  peerId: string;
}) => {
  socket.emit("join-group-call-request", data);
};

export const sendCloseGroupCallRequest = (roomId: string) => {
  socket.emit("close-group-call-by-host", roomId);
};

export const sendLeaveGroupCallRequest = ({
  socketId,
  roomId,
}: {
  socketId: string;
  roomId: string;
}) => {
  socket.emit("leave-group-call", { socketId, roomId });
};

export const sendGroupUsersUpdate = ({
  user,
  roomId,
  type,
}: {
  user: groupCallUserDataType;
  roomId: string;
  type: "add" | "remove";
}) => {
  socket.emit("group-users-change-update", {
    user,
    roomId,
    type,
  });
};

export const sendKickUserRequest = (socketId: string) => {
  socket.emit("kick-user-request", socketId);
};
