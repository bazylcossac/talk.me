import VideoIcons from "@/components/profile-dashboard/VideoIcons";
import { handleLeaveCall } from "@/connection/webrtcConnection";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";

function CallButtons({ className }: { className: string }) {
  // const screenSharingEnabled = store.
  const [screenSharingEnabled, setScreenSharingEnabled] = useState(false);

  const leaveCall = () => {
    handleLeaveCall();
  };

  const screenSharing = () => {
    setScreenSharingEnabled((prev) => !prev);
    
    
    handleScreenSharing(!screenSharingEnabled);
  };

  return (
    <div className={className}>
      <VideoIcons
        optionsVisible={false}
        className="flex text-[20px] gap-4 bg-[#2c2c2c] rounded-md p-2"
      />
      <LuScreenShare
        className="text-blue-500 bg-blue-300 hover:text-blue-300 hover:bg-blue-500  rounded-md p-1.75"
        onClick={screenSharing}
      />
      <IoClose
        className="text-white bg-red-500 hover:text-red-400 hover:bg-red-700  rounded-md p-1.75"
        onClick={leaveCall}
      />
    </div>
  );
}

export default CallButtons;
