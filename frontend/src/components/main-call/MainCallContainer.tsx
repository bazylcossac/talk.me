import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";

function MainCallContainer() {
  const callState = useSelector((state: RootState) => state.user.userCallState);

  if (callState !== callStatus.CALL_IN_PROGRESS) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-2">
        <p className="text-white/30 font-bold">Call someone</p>
        <p className="text-white/30 ">or</p>
        <Button className="hover:cursor-pointer hover:bg-[#303030]">
          Start group call
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#222222] w-full h-full rounded-md relative">
      <LocalVideo />
      <RemoteVideo />
    </div>
  );
}

export default MainCallContainer;
