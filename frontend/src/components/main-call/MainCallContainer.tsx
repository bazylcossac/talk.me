import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import Logo from "../Logo";

function MainCallContainer() {
  const callState = useSelector((state: RootState) => state.user.userCallState);
  const isInGroupCall = useSelector(
    (state: RootState) => state.user.isInGroupCall
  );

  if (callState !== callStatus.CALL_IN_PROGRESS) {
    return (
      <section className="h-full w-full ">
        <div className="absolute right-0 mr-4">
          <Logo className="w-20" />
        </div>
        <div className="flex flex-col h-full  items-center justify-center gap-2 fixed right-1/2 transform translate-x-1/2">
          <p className="text-white/30 font-bold">Call someone</p>
          <p className="text-white/30 ">or</p>
          <Button className="hover:cursor-pointer hover:bg-[#303030]">
            Start group call
          </Button>
        </div>
      </section>
    );
  }

  if (isInGroupCall && callState === callStatus.CALL_IN_PROGRESS) {
    <section className=" w-full h-full  rounded-md flex flex-row gap-4">
      <div className="bg-[#222222] relative flex flex-row rounded-md w-full">
        <RemoteVideo />
        <LocalVideo />
      </div>
    </section>;
  }

  if (!isInGroupCall && callState === callStatus.CALL_IN_PROGRESS) {
    return (
      <section className=" w-full h-full  rounded-md flex flex-row gap-4">
        <div className="bg-[#222222] relative flex flex-row rounded-md w-full">
          <RemoteVideo />
          <LocalVideo />
        </div>
      </section>
    );
  }
}

export default MainCallContainer;
