export const userStatus = {
  ACTIVE: "ACTIVE",
  DONT_DISTURB: "DONT_DISTURB",
  IN_CALL: "IN_CALL",
};

export const callStatus = {
  CALL_REQUESTED: "CALL_REQUESTED",
  // caller => cannot call 2 users at the same time
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
};
