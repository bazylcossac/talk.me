import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRef, useEffect } from "react";

function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStream = useSelector(
    (state: RootState) => state.webrtc.localStream
  );

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef!.current!.srcObject = localStream;

      videoRef!.current!.onloadedmetadata = () => {
        videoRef!.current!.play();
      };
    }
  }, [localStream]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default LocalVideo;
