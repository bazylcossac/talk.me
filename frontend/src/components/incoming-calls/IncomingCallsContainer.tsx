import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import IncomingCallBox from "./IncomingCallBox";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { handleRejectCall } from "@/connection/webSocketConnection";

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
  const shownToastIds = useRef<Set<string>>(new Set());
  const callingUsersData = useSelector(
    (state: RootState) => state.webrtc.callingUsersData
  );
  console.log(callingUsersData);

  const deleteFromShownToastIds = (socketId: string) => {
    shownToastIds.current.delete(`incoming-call-${socketId}`);
  };
  // );
  useEffect(() => {
    callingUsersData.forEach((user) => {
      const toastId = `incoming-call-${user.socketId}`;

      if (!shownToastIds.current.has(toastId)) {
        toast.custom(
          (t) => (
            <IncomingCallBox
              user={user}
              toastId={t}
              deleteFromShownToastIds={deleteFromShownToastIds}
            />
          ),
          {
            id: toastId,
            duration: 10000,
            onDismiss: () => {
              toast.dismiss(toastId);
              deleteFromShownToastIds(user.socketId); // usunac z redux stora dodatkowo jescze
              handleRejectCall({
                callerSocketId: user.socketId,
              });
            },
          }
        );

        shownToastIds.current.add(toastId);
      }
    });
  }, [callingUsersData]);

  return null;
}

export default IncomingCallContainer;
