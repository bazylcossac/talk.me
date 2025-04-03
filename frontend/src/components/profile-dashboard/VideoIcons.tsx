import { useSelector, useDispatch } from "react-redux";
import { IoMdSettings } from "react-icons/io";
import { BiSolidMicrophone } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { BiSolidMicrophoneOff } from "react-icons/bi";
import { RootState } from "../../store/store";
import { setCameraEnabled, setMicEnabled } from "../../store/slices/webrtc";

function VideoIcons() {
  const dispatch = useDispatch();
  const micEnabled = useSelector((state: RootState) => state.webrtc.micEnabled);
  const cameraEnabled = useSelector(
    (state: RootState) => state.webrtc.cameraEnabled
  );

  return (
    <div className="flex justify-center gap-6 md:gap-4 text-[#cdcdcd] [&>*]:cursor-pointer [&>*]:hover:text-[#f1f1f1] text-2xl md:text-[17px] w-full">
      <div onClick={() => dispatch(setMicEnabled(!micEnabled))}>
        {micEnabled ? (
          <BiSolidMicrophone />
        ) : (
          <BiSolidMicrophoneOff className="text-red-500" />
        )}
      </div>
      <div onClick={() => dispatch(setCameraEnabled(!cameraEnabled))}>
        {cameraEnabled ? (
          <HiMiniVideoCamera />
        ) : (
          <HiMiniVideoCameraSlash className="text-red-500" />
        )}
      </div>
      <IoMdSettings />
    </div>
  );
}

export default VideoIcons;
