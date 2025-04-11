import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import Logo from "../Logo";
import CallChat from "./chat-button/CallChat";

function MainCallContainer() {
  const callState = useSelector((state: RootState) => state.user.userCallState);

  if (callState !== callStatus.CALL_IN_PROGRESS) {
    return (
      <div className="h-full ">
        <div className="absolute right-0 mr-4">
          <Logo className="w-20" />
        </div>
        <div className="flex flex-col h-full  items-center justify-center gap-2">
          <p className="text-white/30 font-bold">Call someone</p>
          <p className="text-white/30 ">or</p>
          <Button className="hover:cursor-pointer hover:bg-[#303030]">
            Start group call
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full h-full rounded-md flex flex-row gap-4">
      <div className="bg-[#222222] relative flex flex-row rounded-md">
        <RemoteVideo />
        <LocalVideo />
      </div>
      <div>
        <CallChat />
      </div>
    </div>
  );
}

export default MainCallContainer;
