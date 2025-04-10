import { useSelector, useDispatch } from "react-redux";
import { IoMdSettings } from "react-icons/io";
import { BiSolidMicrophone } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { HiMiniVideoCameraSlash } from "react-icons/hi2";
import { BiSolidMicrophoneOff } from "react-icons/bi";
import { RootState } from "../../store/store";
import { setCameraEnabled, setMicEnabled } from "../../store/slices/webrtc";
import { useState } from "react";
import SettingsDialog from "./settings-dialog/SettingsDialog";

function VideoIcons({
  className,
  optionsVisible = false,
}: {
  className: string;
  optionsVisible: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const micEnabled = useSelector((state: RootState) => state.webrtc.micEnabled);
  const cameraEnabled = useSelector(
    (state: RootState) => state.webrtc.cameraEnabled
  );

  const localStream = useSelector(
    (state: RootState) => state.webrtc.localStream
  );

  const handleMicEnabled = () => {
    dispatch(setMicEnabled(!micEnabled));
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = !micEnabled;
    }
  };

  const handleCameraEnabled = () => {
    dispatch(setCameraEnabled(!cameraEnabled));
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = !cameraEnabled;
    }
  };

  const handleShowSettings = () => {
    setShowOptions((prev) => !prev);
  };

  return (
    <>
      <div className={className}>
        <div onClick={handleMicEnabled}>
          {micEnabled ? (
            <BiSolidMicrophone />
          ) : (
            <BiSolidMicrophoneOff className="text-red-500" />
          )}
        </div>
        <div onClick={handleCameraEnabled}>
          {cameraEnabled ? (
            <HiMiniVideoCamera />
          ) : (
            <HiMiniVideoCameraSlash className="text-red-500" />
          )}
        </div>
        {optionsVisible && <IoMdSettings onClick={handleShowSettings} />}
      </div>
      {showOptions && (
        <SettingsDialog
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      )}
    </>
  );
}

export default VideoIcons;
