import { handleLeaveCall } from "@/connection/webrtcConnection";
import { IoClose } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";

function CallButtons({ className }: { className: string }) {
  const leaveCall = () => {
    handleLeaveCall();
  };

  return (
    <div className={className}>
      <LuScreenShare className="text-blue-500 bg-blue-300 hover:text-blue-300 hover:bg-blue-500  rounded-md p-1.75" />
      <IoClose
        className="text-white bg-red-500 hover:text-red-400 hover:bg-red-700  rounded-md p-1.75"
        onClick={leaveCall}
      />
    </div>
  );
}

export default CallButtons;
