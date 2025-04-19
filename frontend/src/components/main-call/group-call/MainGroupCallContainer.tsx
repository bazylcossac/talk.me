import { useRef } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import LocalVideo from "../LocalVideo";
import GroupVideoElement from "./GroupVideoElement";
import { getGridClasses } from "@/functions/getGridClasses";
import CallButtons from "../call-buttons/CallButtons";

function MainGroupCallContainer() {
  const divRef = useRef<HTMLDivElement>(null);

  const groupCallStreams = useSelector(
    (state: RootState) => state.webrtc.groupCallStreams
  );
  const groupCallUsers = useSelector(
    (state: RootState) => state.webrtc.groupCallUsers
  );

  return (
    <div ref={divRef} className="w-full h-full relative">
      <div
        className={`w-full h-full transition-none ${getGridClasses(
          groupCallStreams.length
        )}`}
      >
        {groupCallStreams?.map((stream: MediaStream) => {
          const user = groupCallUsers?.find(
            (user) => user.streamId === stream.id
          );
          return (
            <GroupVideoElement
              stream={stream}
              user={user?.user.username || "unknown"}
              key={stream.id}
            />
          );
        })}

        <LocalVideo
          divClassName="relative z-10 shadow-2xl m-2"
          videoClassName="rounded-md border-1 border-black/50 w-full max-h-[400px] object-cover"
        />
      </div>
      <div className="mt-auto p-2 absolute bottom-5 w-full">
        <CallButtons
          className={
            "flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300"
          }
          divRef={divRef}
        />
      </div>
    </div>
  );
}

export default MainGroupCallContainer;
