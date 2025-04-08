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
    <div className="ml-auto inline-block absolute right-0 m-4 z-10 shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md max-w-[250px]  "
      />
    </div>
  );
}

export default LocalVideo;
