import store from "@/store/store";
import { useRef, useEffect } from "react";

function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStream = store.getState().webrtc.remoteStream;

  useEffect(() => {
    videoRef!.current!.srcObject = localStream;

    videoRef!.current!.onloadedmetadata = () => {
      videoRef!.current!.play();
    };
  }, [localStream]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default LocalVideo;
