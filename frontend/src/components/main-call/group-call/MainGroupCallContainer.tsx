import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import LocalVideo from "../LocalVideo";
import GroupVideoElement from "./GroupVideoElement";

function MainGroupCallContainer() {
  const groupCallStreams = useSelector(
    (state: RootState) => state.webrtc.groupCallStreams
  );

  const getGridClasses = () => {
    switch (groupCallStreams.length) {
      case 2:
        return "grid grid-cols-2 place-items-center gap-4 justify-center";
      case 3:
        return "grid grid-cols-2 grid-rows-2 gap-4 place-items-center";
      case 4:
        return "grid grid-cols-2 gap-4 place-items-center";
      default:
        return "flex justify-center items-center";
    }
  };

  return (
    <div className={`w-full h-full p-2 ${getGridClasses()}`}>
      {groupCallStreams?.map((stream: MediaStream) => (
        <GroupVideoElement stream={stream} />
      ))}

      <div>
        <LocalVideo
          divClassName="z-10 shadow-2xl row-span-3 "
          videoClassName="rounded-md border-1 border-black/50 w-full max-h-[400px]"
        />
      </div>
    </div>
  );
}

export default MainGroupCallContainer;
