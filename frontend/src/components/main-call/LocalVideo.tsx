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

  // useEffect(() => {
  //   const changeOutputDevice = async () => {
  //     console.log("SELECTING 2 EFFECT");
  //     await videoRef.current?.setSinkId(selectedOutputDeviceId);
  //   };
  //   changeOutputDevice();
  // }, [selectedOutputDeviceId]);

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
