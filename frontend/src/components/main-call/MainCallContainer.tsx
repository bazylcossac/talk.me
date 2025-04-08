import { callStatus } from "@/lib/constants";
import store from "@/store/store";
import LocalVideo from "./LocalVideo";
import RemoteVideo from "./RemoteVideo";

function MainCallContainer() {
  const callState = store.getState().user.userCallState;



  //   if (callState !== callStatus.CALL_IN_PROGRESS) return;

  return (
    <div className="bg-[#222222] w-full h-full rounded-md">
      <LocalVideo />
      <RemoteVideo />
    </div>
  );
}

export default MainCallContainer;
