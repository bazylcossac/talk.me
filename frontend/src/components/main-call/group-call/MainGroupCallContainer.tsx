import { useRef } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import GroupVideoElement from "./GroupVideoElement";
import { getGridClasses } from "@/functions/getGridClasses";

import GroupCallButtons from "./GroupCallButtons";

function MainGroupCallContainer() {
  const divRef = useRef<HTMLDivElement>(null);

  const groupCallStreams = useSelector(
    (state: RootState) => state.webrtc.groupCallStreams
  );
  const localStream = useSelector(
    (state: RootState) => state.webrtc.localStream
  );

  const allStreams = [...groupCallStreams, localStream!];

  const groupCallUsers = useSelector(
    (state: RootState) => state.webrtc.groupCallUsers
  );

  return (
    <div ref={divRef} className="w-full h-full relative overflow-hidden">
      <div
        className={`w-full h-full transition-none p-2 ${getGridClasses(
          allStreams.length
        )}`}
      >
        {allStreams?.map((stream: MediaStream) => {
          const user = groupCallUsers?.find(
            (user) => user.streamId === stream.id
          );
          return (
            <GroupVideoElement
              stream={stream}
              user={user!.user}
              key={stream.id}
            />
          );
        })}
      </div>
      <div className="mt-auto  absolute bottom-5 right-1/2 translate-x-1/2 z-10 ">
        <GroupCallButtons
          className={
            "flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300  bg-[#101010] rounded-md p-2"
          }
          divRef={divRef as React.RefObject<HTMLDivElement>}
        />
      </div>
    </div>
  );
}

export default MainGroupCallContainer;
