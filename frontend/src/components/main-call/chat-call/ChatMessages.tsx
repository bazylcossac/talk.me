import { cn } from "@/lib/utils";
import { RootState } from "@/store/store";
import { chatItemType, chatMessageType } from "@/types/types";
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

  console.log(allMessages);
  return (
    <div className="mb-12 mt-6 overflow-y-auto w-full scrollbar-hide flex flex-col">
      {/* {allMessages
        ?.filter((message) => message.message !== "")
        .map((message: chatItemType) => (
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
              {(message.type = "message" && <p>{message.message}</p>)}
            </p>
          </div>
        ))} */}
      <div ref={lastElement} className="h-[5px]"></div>
    </div>
  );
}

export default ChatMessages;
