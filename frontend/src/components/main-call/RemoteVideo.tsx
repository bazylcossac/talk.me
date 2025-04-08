import  { RootState } from "@/store/store";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

function LocalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteStream = useSelector(
    (state: RootState) => state.webrtc.remoteStream
  );

  useEffect(() => {
    if (videoRef.current && remoteStream)
      videoRef!.current!.srcObject = remoteStream;

    videoRef!.current!.onloadedmetadata = () => {
      videoRef!.current!.play();
    };
  }, [remoteStream]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
}

export default LocalVideo;
