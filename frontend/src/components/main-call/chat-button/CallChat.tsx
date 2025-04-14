import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { IoIosArrowForward, IoMdSend } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import { setRightContainerVisible } from "@/store/slices/app";
import { RootState } from "@/store/store";
import { setCurrentCallMessages } from "@/store/slices/webrtc";
import { handleSendMessage } from "@/connection/webrtcConnection";
import { useUser } from "@clerk/clerk-react";
function CallChat() {
  const formRef = useRef<HTMLFormElement>(null);
  const user = useUser()
  const dispatch = useDispatch();
  const rightContainerVisible = useSelector(
    (state: RootState) => state.app.rightContainerVisible
  );
  const allMessages = useSelector(
    (state: RootState) => state.webrtc.currentCallChatMessages
  );

  const sendMessage = (formData: FormData) => {
    const message = formData.get("messageInput") as string;
    if (!message) return;
    dispatch(setCurrentCallMessages({ your: true, username:user.user?.username || user.user?.fullName, message }));
    handleSendMessage({username:user.user?.username || user.user?.fullName, message});
    formRef!.current!.reset();
  };

  return (
    <div className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide flex">
      <div className="p-1 flex items-center gap-4 z-10  bg-[#383838] absolute w-[250px] rounded-t-md">
        <div
          onClick={() =>
            dispatch(setRightContainerVisible(!rightContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25">
            <IoIosArrowForward className="text-md cursor-pointer" />
          </div>
        </div>
      </div>
      <div>
        {allMessages?.map(message => )}
      </div>
      <div className="mt-auto w-full p-2">
        <form
          action={sendMessage}
          className="flex items-center justify-between gap-2"
          ref={formRef}
        >
          <FaFileExport className="text-lg hover:text-white/20 cursor-pointer transition " />
          <Input
            className="border-1 border-white/30 focus-visible:ring-0"
            name="messageInput"
          />
          <IoMdSend className="text-xl hover:text-white/30 cursor-pointer transition" />
        </form>
      </div>
    </div>
  );
}

export default CallChat;
