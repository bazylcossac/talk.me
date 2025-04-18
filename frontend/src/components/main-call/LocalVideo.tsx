import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

function LocalVideo({
  divClassName,
  videoClassName,
}: {
  divClassName: string;
  videoClassName: string;
}) {
  const user = useUser();
  const videoRef = useRef<HTMLVideoElement>(null);

  const localStream = useSelector(
    (state: RootState) => state.webrtc.localStream
  );
  const selectedOutputDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedOutputDeviceId
  );
  const localCameraHide = useSelector(
    (state: RootState) => state.user.localCameraHide
  );

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef!.current!.srcObject = localStream;
      if (selectedOutputDeviceId) {
        videoRef.current.setSinkId(selectedOutputDeviceId);
      }
      videoRef!.current!.onloadedmetadata = () => {
        videoRef!.current!.play();
      };
    }
  }, [localStream, selectedOutputDeviceId]);

  return (
    <div
      className={cn(divClassName, {
        hidden: localCameraHide,
        "inline-block": !localCameraHide,
      })}
    >
      <video ref={videoRef} autoPlay playsInline className={videoClassName} />
      <p className="absolute bottom-0 p-1 text-xs text-white text-shado-2xl bg-blue-400 rounded-md m-1 ">
        {user.user?.username || user.user?.fullName}
      </p>
    </div>
  );
}

export default LocalVideo;
