import { toast } from "sonner";
import { userDataType } from "@/types/types";
import { Button } from "../ui/button";
import {
  handleRejectCall,
  handleSendAcceptCall,
} from "@/connection/webrtcConnection";

function IncomingCallBox({
  user,
  toastId,
  deleteFromShownToastIds,
}: {
  user: userDataType;
  toastId: string | number;
  deleteFromShownToastIds: (socketId: string) => void;
}) {
  const handleAcceptCall = () => {
    handleSendAcceptCall({
      callerSocketID: user.socketId,
    });
  };

  const handleDeclineCall = () => {
    handleRejectCall({
      callerSocketID: user.socketId,
    });
  };

  return (
    <div className="bg-[#171717] rounded-md m-2 p-4 flex flex-col z-100">
      <p>Incoming call</p>
      <div className="flex flex-row items-center gap-2 mt-4">
        <img
          src={user.imageUrl}
          alt="incoming call user image"
          className="rounded-full size-6"
        />
        <p className="text-xs max-w-[100px]">{user.username}</p>
      </div>

      <div className="flex flex-row items-center gap-4  mt-4 [&>*]:cursor-pointer">
        <Button
          variant="secondary"
          className="bg-green-500 text-white hover:bg-green-700 text-xs"
          onClick={() => {
            handleAcceptCall();
            toast.dismiss(toastId);
            deleteFromShownToastIds(user.socketId);
          }}
        >
          Accept
        </Button>
        <Button
          variant="destructive"
          className="hover:bg-red-700 text-xs"
          onClick={() => {
            handleDeclineCall();
            toast.dismiss(toastId);
            deleteFromShownToastIds(user.socketId);
          }}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}

export default IncomingCallBox;
