export const userStatus = {
  ACTIVE: "ACTIVE",
  DONT_DISTURB: "DONT_DISTURB",
  IN_CALL: "IN_CALL",
};

export const callStatus = {
  CALL_REQUESTED: "CALL_REQUESTED",
  // caller => cannot call multiple users at the same time
  // calle => can have multiple callers
  CALL_AVAILABLE: "CALL_AVAILABLE",
  // caller => can call, can be called
  // calle => can be called, can call
  CALL_UNVAILABLE: "CALL_UNVAILABLE",
  // caller => can call, can't be called
  // calle => can't be called, can call
  CALL_IN_PROGRESS: "CALL_IN_PROGRESS",
  // caller => can call others, can be called
  // calle => same
};

export const preOfferAnswerStatus = {
  CALL_ACCEPTED: "CALL_ACCEPTED",
  CALL_REJECTED: "CALL_REJECTED",
  CALL_UNVAILABLE: "CALL_UNVAILABLE",
  USER_CALL_IN_PROGRESS: "USER_CALL_IN_PROGRESS",
} as const;

// WEBRTC CONSTANTS

export const constraints = {
  video: true,
  audio: true,
};

export const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const screenSharingHighQualityOptions = {
  video: {
    width: { ideal: 1920 },
    heigth: { ideal: 1080 },
    frameRate: { ideal: 30 },
    cursor: "always",
  },
};

export const screenSharingLowQualityOptions = {
  video: {
    width: { ideal: 630 },
    heigth: { ideal: 480 },
    frameRate: { ideal: 15 },
    cursor: "always",
  },
};
