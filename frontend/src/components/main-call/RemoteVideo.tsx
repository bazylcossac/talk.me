import { RootState } from "@/store/store";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CallButtons from "./call-buttons/CallButtons";

function LocalVideo() {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const remoteStream = useSelector(
    (state: RootState) => state.webrtc.remoteStream
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (videoRef.current && remoteStream)
      videoRef!.current!.srcObject = remoteStream;

    videoRef!.current!.onloadedmetadata = () => {
      videoRef!.current!.play();
    };
  }, [remoteStream]);

  useEffect(() => {
    const divElement = divRef.current!;
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    divElement.addEventListener("mouseenter", handleMouseEnter);
    divElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      divElement.removeEventListener("mouseenter", handleMouseEnter);
      divElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dispatch]);

  return (
    <div
      className="h-full flex flex-col justify-center p-4 relative"
      ref={divRef}
    >
      {!remoteStream && (
        <div className="h-full flex items-center justify-center">
          <p className="animate-pulse text-white/30">
            Waiting for user to connect...
          </p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md h-full"
      />

      <div className="mt-auto p-2 absolute bottom-5 w-full   ">
        <CallButtons
          className={`flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300 ${
            isVisible ? "animate-fade-up" : " animate-fade-down animate-reverse"
          }`}
        />
      </div>
    </div>
  );
}

export default LocalVideo;
