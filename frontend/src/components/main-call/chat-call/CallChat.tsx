import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { setRightContainerVisible } from "@/store/slices/app";
import { RootState } from "@/store/store";
import { setCurrentCallMessages } from "@/store/slices/webrtc";
import { useUser } from "@clerk/clerk-react";
import ChatForm from "./ChatForm";
import ChatMessages from "./ChatMessages";
import { handleSendMessage } from "@/connection/dataChannelsFunc";

function CallChat() {
  const dispatch = useDispatch();
  const rightContainerVisible = useSelector(
    (state: RootState) => state.app.rightContainerVisible
  );
  const formRef = useRef<HTMLFormElement>(null);
  const user = useUser();
  if (!user.user) {
    throw new Error("SOMEHOW YOU ARE NOT LOGGED AND USE CHAT");
  }

  const sendMessage = (formData: FormData) => {
    const message = formData.get("messageInput") as string;
    if (!message) return;
    const messageId = crypto.randomUUID();
    handleSendMessage({
      username: user.user.username! || user.user.fullName!,
      message,
      messageId,
      type: "message",
    });

    dispatch(
      setCurrentCallMessages({
        type: "message",
        your: true,
        username: user.user?.username || user.user.fullName!,
        message,
        messageId,
      })
    );
    formRef!.current!.reset();
  };

  return (
    <section className="bg-[#222222] md:w-[250px] h-full rounded-md overflow-y-auto scrollbar-hide flex relative">
      <div className="p-1 flex items-center gap-4 z-10  bg-[#383838] absolute w-full rounded-t-md">
        <button
          onClick={() =>
            dispatch(setRightContainerVisible(!rightContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25 ">
            <IoIosArrowForward className="text-md curor-pointer" />
          </div>
        </button>
      </div>
      <ChatMessages />
      <ChatForm sendMessage={sendMessage} formRef={formRef} />
    </section>
  );
}

export default CallChat;
