import { RootState } from "@/store/store";
import { userDataType } from "@/types/types";
import { useEffect, useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

function GroupVideoElement({
  stream,
  user,
}: {
  stream: MediaStream;
  user: userDataType;
}) {
  const isUserHosting = useSelector(
    (state: RootState) => state.user.hasCreatedGroupCall
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const ref = videoRef.current;
    if (stream && ref) {
      ref.srcObject = stream;

      ref.onloadedmetadata = () => {
        ref.play();
      };
    }
    return () => {
      ref!.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="relative m-2 z-1 w-full h-full overflow-hidden rounded-md">
      <img
        src={user?.imageUrl}
        alt={`${user?.username} image`}
        className="absolute size-10 rounded-md right-0 m-1"
      />

      {isUserHosting && (
        <button className="absolute top-0 left-0 m-2">
          <BsThreeDots className="text-white/50 hover:text-white transition cursor-pointer" />
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md object-cover w-full h-full"
      />
      <p className="absolute bottom-0 right-0  text-xs text-white text-shado-2xl bg-[#222222] p-2 rounded-md m-1 border-1 border-white/20">
        {user?.username}
      </p>
    </div>
  );
}

export default GroupVideoElement;
