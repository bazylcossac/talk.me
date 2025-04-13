import { RootState } from "@/store/store";
import CallChat from "./main-call/chat-button/CallChat";
import { useDispatch, useSelector } from "react-redux";
import { setRightContainerVisible } from "@/store/slices/app";
import { IoIosArrowBack } from "react-icons/io";
import { callStatus } from "@/lib/constants";
function RightContainer() {
  const dispatch = useDispatch();

  const rightContainerVisible = useSelector(
    (state: RootState) => state.app.rightContainerVisible
  );
  const callState = useSelector((state: RootState) => state.user.userCallState);

  if (!rightContainerVisible && callState === callStatus.CALL_IN_PROGRESS)
    return (
      <div
        className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25 "
        onClick={() =>
          dispatch(setRightContainerVisible(!rightContainerVisible))
        }
      >
        <IoIosArrowBack className="text-md cursor-pointer" />
      </div>
    );

  if (callState === callStatus.CALL_IN_PROGRESS) {
    return (
      <div className="h-full md:max-w-[250px]">
        <CallChat />
      </div>
    );
  }
}

export default RightContainer;
