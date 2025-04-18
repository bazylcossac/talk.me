import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import LocalVideo from "../LocalVideo";
import GroupVideoElement from "./GroupVideoElement";

function MainGroupCallContainer() {
  const groupCallStreams = useSelector(
    (state: RootState) => state.webrtc.groupCallStreams
  );

  const groupCallUsers = useSelector(
    (state: RootState) => state.webrtc.groupCallUsers
  );

  console.log(groupCallUsers);

  const getGridClasses = () => {
    switch (groupCallStreams.length) {
      case 2:
        return "grid grid-cols-2 place-items-center  justify-center";
      case 3:
        return "grid grid-cols-2 grid-rows-2 gap-1 place-items-center";
      case 4:
        return "grid grid-cols-2 gap-1 place-items-center";
      default:
        return "flex justify-center items-center";
    }
  };

  return (
    <div className={`w-full h-full transition-none  ${getGridClasses()}`}>
      {groupCallStreams?.map((stream: MediaStream) => {
        const user = groupCallUsers?.find(
          (user) => user.streamId === stream.id
        );
        return (
          <GroupVideoElement stream={stream} user={user} key={stream.id} />
        );
      })}

      <LocalVideo
        divClassName="relative z-10 shadow-2xl m-2"
        videoClassName="rounded-md border-1 border-black/50 w-full max-h-[400px] object-cover"
      />
    </div>
  );
}

export default MainGroupCallContainer;
