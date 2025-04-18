import { useEffect, useRef } from "react";

function GroupVideoElement({
  stream,
  user,
}: {
  stream: MediaStream;
  user: any;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = stream;

    videoRef.current!.onloadedmetadata = () => {
      videoRef.current!.play();
    };
  }, [stream]);

  return (
    <div className="">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md max-h-[400px] w-full"
      />
      <p>{user.user.username}</p>
    </div>
  );
}

export default GroupVideoElement;
