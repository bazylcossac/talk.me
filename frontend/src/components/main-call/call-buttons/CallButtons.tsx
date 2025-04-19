import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import VideoIcons from "@/components/profile-dashboard/VideoIcons";
import { handleLeaveCall } from "@/connection/webrtcConnection";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";
import { RootState } from "@/store/store";
import {
  setLocalCameraHide,
  setScreenSharingEnabled,
} from "@/store/slices/user";
import { handleScreenSharing } from "@/connection/webrtcDevicesFunc";
import { Ref, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function CallButtons({
  className,
  divRef,
}: {
  className: string;
  divRef: Ref<HTMLDivElement>;
}) {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const dispatch = useDispatch();
  const screenSharingEnabled = useSelector(
    (state: RootState) => state.user.screenSharingEnabled
  );
  const localCameraHide = useSelector(
    (state: RootState) => state.user.localCameraHide
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

  useEffect(() => {
    const div = divRef.current!;

    const mouseEnter = () => {
      setButtonsVisible(true);
    };

    const mouseLeave = () => {
      setButtonsVisible(false);
    };

    div.addEventListener("mouseenter", mouseEnter);
    div.addEventListener("mouseleave", mouseLeave);

    return () => {
      div.removeEventListener("mouseenter", mouseEnter);
      div.removeEventListener("mouseleave", mouseLeave);
    };
  }, [divRef]);

  return (
    <section
      className={cn(className, {
        "animate-fade-up": buttonsVisible,
        " animate-fade-down animate-reverse": !buttonsVisible,
      })}
    >
      <VideoIcons
        optionsVisible={false}
        className="flex text-[20px] gap-4 bg-[#2c2c2c] rounded-md p-2"
      />
      <button onClick={handleLocalCameraHide}>
        {!localCameraHide ? (
          <FaRegEye className="text-green-600 bg-green-300 hover:text-green-300 hover:bg-green-600 rounded-md p-1.75" />
        ) : (
          <FaRegEyeSlash className="text-green-300 bg-green-600 hover:text-green-600 hover:bg-green-300 rounded-md p-1.75" />
        )}
      </button>

      <div className="relative">
        <LuScreenShare
          className="text-blue-500 bg-blue-300 hover:text-blue-300 hover:bg-blue-500  rounded-md p-1.75 "
          onClick={screenSharing}
        />
        {screenSharingEnabled && (
          <div className="absolute size-3 bg-red-500 rounded-full -top-1 -right-1 animate-pulse"></div>
        )}
      </div>

      <IoClose
        className="text-white bg-red-500 hover:text-red-400 hover:bg-red-700  rounded-md p-1.75"
        onClick={leaveCall}
      />
    </section>
  );
}

export default CallButtons;
