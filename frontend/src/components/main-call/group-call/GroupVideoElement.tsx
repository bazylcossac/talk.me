import { useEffect, useRef } from "react";

function GroupVideoElement({
  stream,
  user,
}: {
  stream: MediaStream;
  user: string;
}) {
  console.log(user);
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log(user);
  useEffect(() => {
    videoRef.current!.srcObject = stream;

    videoRef.current!.onloadedmetadata = () => {
      videoRef.current!.play();
    };
  }, [stream]);

  return (
    <div className="relative m-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md max-h-[400px] w-full object-cover"
      />
      <p className="absolute bottom-0 p-1 text-xs text-white text-shado-2xl bg-blue-400 rounded-md m-1 ">
        {user}
      </p>
    </div>
  );
}

export default GroupVideoElement;
