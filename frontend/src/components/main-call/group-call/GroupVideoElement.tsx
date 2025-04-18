import { useEffect, useRef } from "react";

function GroupVideoElement({ stream }: { stream: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = stream;

    videoRef.current!.onloadedmetadata = () => {
      videoRef.current!.play();
    };
  }, [stream]);

  return (
    <div className="place-self-center ">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md w-full max-h-[400px]"
      />
    </div>
  );
}

export default GroupVideoElement;
