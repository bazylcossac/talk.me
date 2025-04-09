import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import IncomingCallBox from "./IncomingCallBox";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { handleRejectCall } from "@/connection/webrtcConnection";

function IncomingCallContainer() {
  const shownToastIds = useRef<Set<string>>(new Set());
  const callingUsersData = useSelector(
    (state: RootState) => state.webrtc.callingUsersData
  );
  console.log(callingUsersData);

  const deleteFromShownToastIds = (socketId: string) => {
    shownToastIds.current.delete(`incoming-call-${socketId}`);
  };

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
            onDismiss: () => {
              toast.dismiss(toastId);
              deleteFromShownToastIds(user.socketId);
              handleRejectCall({
                callerSocketID: user.socketId,
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
