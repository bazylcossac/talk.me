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
      <p className="absolute bottom-4 p-1 text-white text-shado-2xl text-xs bg-blue-400 rounded-md m-1">
        {calleData.username}
      </p>

      <div className="mt-auto p-2 absolute bottom-5 w-full   ">
        <CallButtons
          className={
            "flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300 mb-4"
          }
          divRef={divRef}
        />
      </div>
    </div>
  );
}

export default RemoteVideo;
