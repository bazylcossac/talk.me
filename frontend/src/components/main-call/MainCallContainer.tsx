import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import { useSelector } from "react-redux";
import MainGroupCallContainer from "./group-call/MainGroupCallContainer";
import MainCallContNoCall from "./MainCallContNoCall";

function MainCallContainer() {
  const callState = useSelector((state: RootState) => state.user.userCallState);
  const isInGroupCall = useSelector(
    (state: RootState) => state.user.isInGroupCall
  );

  // no call
  if (callState !== callStatus.CALL_IN_PROGRESS) {
    return (
      <section className="h-full w-full hidden md:inline-block">
        <MainCallContNoCall />
      </section>
    );
  }

  // group call
  if (isInGroupCall && callState === callStatus.CALL_IN_PROGRESS) {
    return (
      <section className=" w-full h-full  rounded-md flex flex-row gap-4">
        <div className="bg-[#222222] relative flex flex-row rounded-md w-full">
          <MainGroupCallContainer />
        </div>
      </section>
    );
  }
  // peer to peer call
  if (!isInGroupCall && callState === callStatus.CALL_IN_PROGRESS) {
    return (
      <section className=" w-full h-full  rounded-md flex flex-row gap-4">
        <div className="bg-[#222222] relative flex flex-row rounded-md w-full">
          <RemoteVideo />
          <LocalVideo
            divClassName="ml-auto absolute right-0 top-0 m-8  z-10 shadow-2xl"
            videoClassName="rounded-md max-w-[250px] relative border-1 border-black/50"
          />
        </div>
      </section>
    );
  }
}

export default MainCallContainer;
