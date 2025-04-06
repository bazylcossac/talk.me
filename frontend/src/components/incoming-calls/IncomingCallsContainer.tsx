import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import IncomingCallBox from "./IncomingCallBox";
import { toast } from "sonner";
import { useEffect } from "react";

// const callingData = [
//   {
//     username: "dzikidzekson",
//     imageUrl:
//       "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
//     status: callStatus.CALL_AVAILABLE,
//     socketId: "10",
//   },
// ];

function IncomingCallContainer() {
  const callingUsersData = useSelector(
    (state: RootState) => state.webrtc.callingUsersData
  );
  console.log(callingUsersData);

  // );
  useEffect(() => {
    callingUsersData.forEach((user) => {
      // Sprawdź czy toast już istnieje (np. użyj socketId jako id)
      toast.custom((t) => <IncomingCallBox user={user} toastId={t} />, {
        id: user.socketId, // zapobiega duplikacji
        duration: Infinity,
      });
    });
  }, [callingUsersData]);

  return null;
}

export default IncomingCallContainer;
