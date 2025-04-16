import renderMesage from "@/functions/renderMessage";
import { RootState } from "@/store/store";
import { chatItemType } from "@/types/types";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function ChatMessages() {
  const allMessages = useSelector(
    (state: RootState) => state.webrtc.currentCallChatMessages
  );
  const lastElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  return (
    <section className="mb-12 mt-6 overflow-y-auto w-full scrollbar-hide flex flex-col">
      {allMessages.map((message: chatItemType) => renderMesage(message))}
      <div ref={lastElement} className="h-[5px]"></div>
    </section>
  );
}

export default ChatMessages;
