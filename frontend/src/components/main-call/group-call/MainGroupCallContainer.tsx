import { useEffect, useRef, useState } from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import LocalVideo from "../LocalVideo";
import GroupVideoElement from "./GroupVideoElement";
import { getGridClasses } from "@/functions/getGridClasses";
import CallButtons from "../call-buttons/CallButtons";

function MainGroupCallContainer() {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  const groupCallStreams = useSelector(
    (state: RootState) => state.webrtc.groupCallStreams
  );
  const groupCallUsers = useSelector(
    (state: RootState) => state.webrtc.groupCallUsers
  );

  useEffect(() => {
    const div = divRef.current!;

    const mouseEnter = () => {
      setButtonsVisible(true);
    };

    const mouseLeave = () => {
      setButtonsVisible(false);
    };

    div.addEventListener("mouseenter", mouseEnter);
    div.addEventListener("mouseleave", mouseLeave);

    return () => {
      div.removeEventListener("mouseenter", mouseEnter);
      div.removeEventListener("mouseleave", mouseLeave);
    };
  }, []);

  return (
    <div ref={divRef}>
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
      <div>
        <CallButtons
          className={`flex flex-row items-center justify-center gap-4 text-3xl [&>*]:hover:cursor-pointer animate-duration-300 mb-24 ${
            buttonsVisible
              ? "animate-fade-up"
              : " animate-fade-down animate-reverse"
          }`}
        />
      </div>
    </div>
  );
}

export default MainGroupCallContainer;
