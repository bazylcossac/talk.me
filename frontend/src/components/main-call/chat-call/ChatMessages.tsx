import { IMAGE_FILES, VIDEO_FILES } from "@/lib/constants";
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

  const renderMesage = (message: chatItemType) => {
    if (message.type === "message") {
      return (
        <div
          key={message.messageId}
          className={cn("m-2 flex text-clip break-all")}
        >
          <div
            className={cn(
              " inline-block px-2 py-1 rounded-md max-w-[200px] text-sm ",
              {
                "ml-auto bg-blue-500": message.your,
                "bg-neutral-500": !message.your,
              }
            )}
          >
            <p>{message.message}</p>
          </div>
        </div>
      );
    } else if (message.type === "file") {
      if (IMAGE_FILES.includes(message.fileType)) {
        return (
          <div
            key={message.messageId}
            className={cn("m-2 flex text-clip break-all")}
          >
            <div
              className={cn(
                " inline-block px-2 py-1 rounded-md max-w-[200px] text-sm ",
                {
                  "ml-auto bg-blue-500": message.your,
                  "bg-neutral-500": !message.your,
                }
              )}
            >
              <img src={message.url} alt="image" />
            </div>
          </div>
        );
      } else if (VIDEO_FILES.includes(message.fileType)) {
        return (
          <div
            key={message.messageId}
            className={cn("m-2 flex text-clip break-all")}
          >
            <div
              className={cn(
                " inline-block px-2 py-1 rounded-md max-w-[200px] text-sm ",
                {
                  "ml-auto bg-blue-500": message.your,
                  "bg-neutral-500": !message.your,
                }
              )}
            >
              <video src={message.url} controls muted />
            </div>
          </div>
        );
      }
    }
  };

  console.log(allMessages);
  return (
    <div className="mb-12 mt-6 overflow-y-auto w-full scrollbar-hide flex flex-col">
      {allMessages.map((message: chatItemType) => renderMesage(message))}
      <div ref={lastElement} className="h-[5px]"></div>
    </div>
  );
}

export default ChatMessages;
