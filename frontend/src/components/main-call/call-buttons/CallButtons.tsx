import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import VideoIcons from "@/components/profile-dashboard/VideoIcons";
import {
  handleLeaveCall,
  handleScreenSharing,
} from "@/connection/webrtcConnection";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";
import { RootState } from "@/store/store";
import {
  setLocalCameraHide,
  setScreenSharingEnabled,
} from "@/store/slices/webrtc";

function CallButtons({ className }: { className: string }) {
  const dispatch = useDispatch();
  const screenSharingEnabled = useSelector(
    (state: RootState) => state.webrtc.screenSharingEnabled
  );
  const localCameraHide = useSelector(
    (state: RootState) => state.webrtc.localCameraHide
  );
  const leaveCall = () => {
    handleLeaveCall();
  };

  const screenSharing = () => {
    dispatch(setScreenSharingEnabled(!screenSharingEnabled));
    handleScreenSharing(!screenSharingEnabled);
  };

  const handleLocalCameraHide = () => {
    dispatch(setLocalCameraHide(!localCameraHide));
  };

  return (
    <div className={className}>
      <VideoIcons
        optionsVisible={false}
        className="flex text-[20px] gap-4 bg-[#2c2c2c] rounded-md p-2"
      />
      <div onClick={handleLocalCameraHide}>
        {!localCameraHide ? (
          <FaRegEye className="text-green-600 bg-green-300 hover:text-green-300 hover:bg-green-600 rounded-md p-1.75" />
        ) : (
          <FaRegEyeSlash className="text-green-300 bg-green-600 hover:text-green-600 hover:bg-green-300 rounded-md p-1.75" />
        )}
      </div>

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
