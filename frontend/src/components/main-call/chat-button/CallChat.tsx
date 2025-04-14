import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { IoIosArrowForward, IoMdSend } from "react-icons/io";
import { FaFileExport } from "react-icons/fa6";
import { setRightContainerVisible } from "@/store/slices/app";
import { RootState } from "@/store/store";
import { setCurrentCallMessages } from "@/store/slices/webrtc";
import { handleSendMessage } from "@/connection/webrtcConnection";
import { useUser } from "@clerk/clerk-react";
import { chatMessageType } from "@/types/types";
import { cn } from "@/lib/utils";
function CallChat() {
  const formRef = useRef<HTMLFormElement>(null);
  const user = useUser();
  if (!user.user) {
    throw new Error("SOMEHOW YOU ARE NOT LOGGED AND USE CHAT");
  }
  const dispatch = useDispatch();
  const rightContainerVisible = useSelector(
    (state: RootState) => state.app.rightContainerVisible
  );
  const allMessages = useSelector(
    (state: RootState) => state.webrtc.currentCallChatMessages
  );
  const lastElement = useRef<HTMLDivElement>(null);

  const sendMessage = (formData: FormData) => {
    const message = formData.get("messageInput") as string;
    if (!message) return;
    const messageId = crypto.randomUUID();
    handleSendMessage({
      username: user.user.username! || user.user.fullName!,
      message,
      messageId,
    });
    dispatch(
      setCurrentCallMessages({
        your: true,
        username: user.user?.username || user.user?.fullName,
        message,
        messageId,
      })
    );
    formRef!.current!.reset();
  };

  useEffect(() => {
    lastElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <div className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide flex relative">
      <div className="p-1 flex items-center gap-4 z-10  bg-[#383838] absolute w-[250px] rounded-t-md">
        <div
          onClick={() =>
            dispatch(setRightContainerVisible(!rightContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25">
            <IoIosArrowForward className="text-md curor-pointer" />
          </div>
        </div>
      </div>
      <div className="mb-12 mt-6 overflow-y-auto w-full scrollbar-hide flex flex-col">
        {allMessages?.map((message: chatMessageType) => (
          <div
            key={message.messageId}
            className={cn("m-2 flex text-clip break-all")}
          >
            <p
              className={cn(
                " inline-block px-2 py-1 rounded-md max-w-[200px] text-sm ",
                {
                  "ml-auto bg-blue-500": message.your,
                  "bg-neutral-500": !message.your,
                }
              )}
            >
              {message.message}
            </p>
          </div>
        ))}
        <div ref={lastElement} className="h-[5px]"></div>
      </div>
      <div className="mt-auto w-full p-2 absolute bottom-0 z-10 bg-[#383838]">
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
