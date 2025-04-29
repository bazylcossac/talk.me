import { RootState } from "@/store/store";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import CallButtons from "./call-buttons/CallButtons";

function RemoteVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const remoteStream = useSelector(
    (state: RootState) => state.webrtc.remoteStream
  );
  const calleData = useSelector((state: RootState) => state.user.calleData);

  useEffect(() => {
    if (videoRef.current && remoteStream)
      videoRef!.current!.srcObject = remoteStream;

    videoRef!.current!.onloadedmetadata = () => {
      videoRef!.current!.play();
    };
  }, [remoteStream]);

  return (
    <div
      className="h-full w-full  flex flex-col justify-center p-4 relative"
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
        className="rounded-md h-full w-full object-cover relative"
      />
      <p className="absolute bottom-4 right-4  text-xs text-white text-shado-2xl bg-[#222222] p-2 rounded-md m-1 border-1 border-white/20">
        {calleData?.username}
      </p>

      <div className="mt-auto  absolute bottom-5 right-1/2 translate-x-1/2 z-10 ">
        <CallButtons
          className={
            "flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300  bg-[#101010] rounded-md p-2"
          }
          divRef={divRef as React.RefObject<HTMLDivElement>}
        />
      </div>
    </div>
  );
}

export default RemoteVideo;
