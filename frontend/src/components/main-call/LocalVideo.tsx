import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";

function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const localStream = useSelector(
    (state: RootState) => state.webrtc.localStream
  );
  const selectedOutputDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedOutputDeviceId
  );
  const localCameraHide = useSelector(
    (state: RootState) => state.webrtc.localCameraHide
  );

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef!.current!.srcObject = localStream;
      if (selectedOutputDeviceId) {
        console.log("SELECTING 1 EFFECT");
        videoRef.current.setSinkId(selectedOutputDeviceId);
      }
      videoRef!.current!.onloadedmetadata = () => {
        videoRef!.current!.play();
      };
    }
  }, [localStream, selectedOutputDeviceId]);

  return (
    <div
      className={`ml-auto absolute right-0 top-0 m-8 z-10 shadow-2xl ${
        localCameraHide ? "hidden" : "inline-block"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md max-w-[250px]"
      />
    </div>
  );
}

export default LocalVideo;
