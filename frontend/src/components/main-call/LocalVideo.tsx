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
      <div className="absolute right-0 m-1">
        <img
          src={user.user?.imageUrl}
          alt="local user image"
          className="size-10 rounded-md"
        />
      </div>
      <video ref={videoRef} autoPlay playsInline className={videoClassName} />
      <p className="absolute bottom-0 right-0  text-xs text-white text-shado-2xl bg-[#222222] p-2 rounded-md m-1 border-1 border-white/20">
        {user.user?.username || user.user?.fullName}
      </p>
    </div>
  );
}

export default LocalVideo;
