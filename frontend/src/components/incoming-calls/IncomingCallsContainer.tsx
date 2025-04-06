import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import IncomingCallBox from "./IncomingCallBox";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

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

  const deleteFromShownToastIds = (socketId) => {
    shownToastIds.current.delete(`incoming-call-${socketId}`);
    // console.log(shownToastIds.current);
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
            duration: Infinity,
          }
        );

        shownToastIds.current.add(toastId);
      }
    });
  }, [callingUsersData]);

  return null;
}

export default IncomingCallContainer;
