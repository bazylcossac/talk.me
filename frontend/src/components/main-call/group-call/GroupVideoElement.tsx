import store, { RootState } from "@/store/store";
import { userDataType } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";

import UsersSettingsDialog from "./GroupCallUserSettingsDialog";

function GroupVideoElement({
  stream,
  user,
}: {
  stream: MediaStream;
  user?: userDataType;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const loggedUser = store.getState().user.loggedUser;
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
      {user?.imageUrl ? (
        <img
          src={user?.imageUrl}
          alt={`${user?.username} image`}
          className="absolute size-10 rounded-md right-0 m-1"
        />
      ) : (
        <div className="size-10 bg-blue-500"></div>
      )}

      {isUserHosting && user?.socketId !== loggedUser.socketId && (
        <div className="flex">
          <button
            className="absolute top-0 left-0 m-2 z-10"
            onClick={() => setShowSettings(true)}
          >
            <BsThreeDots className="text-white hover:text-white transition cursor-pointer z-10" />
          </button>
        </div>
      )}
      {/* <p>Socket id: ${user?.socketId}</p>
      <p>Stream id: ${stream.id}</p> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-md object-cover w-full h-full"
      />
      <p className="absolute bottom-0 right-0  text-xs text-white text-shado-2xl bg-[#222222] p-2 rounded-md m-1 border-1 border-white/20">
        {user?.username || "guest"}
      </p>
      {isUserHosting && user?.socketId !== loggedUser.socketId && (
        <UsersSettingsDialog
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          user={user}
        />
      )}
    </div>
  );
}

export default GroupVideoElement;
