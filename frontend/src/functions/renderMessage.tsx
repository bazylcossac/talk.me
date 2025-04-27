import { FILE_FILES, IMAGE_FILES, VIDEO_FILES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { chatItemType } from "@/types/types";
import { FaDownload } from "react-icons/fa6";

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
                "ml-auto bg-blue-500 p-1": message.your,
                "bg-neutral-500 p-1": !message.your,
              }
            )}
          >
            <div className="relative">
              <img src={message.url} alt="image" className="rounded-md" />
              <div className="absolute top-2 right-2">
                <a
                  href={message.url}
                  download={`image.${message.fileType.split("/")[1]}`}
                >
                  <FaDownload className="text-white/50 hover:text-white cursor-pointer" />
                </a>
              </div>
            </div>
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
            <div className="relative">
              <video
                src={message.url}
                controls
                muted
                className="h-32 object-cover rounded-md"
              />
              <div className="absolute top-3 right-2">
                <a
                  href={message.url}
                  download={`image.${message.fileType.split("/")[1]}`}
                >
                  <FaDownload className="text-white/50 hover:text-white cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (FILE_FILES.includes(message.fileType)) {
      return (
        <div
          key={message.messageId}
          className={cn("m-2 flex text-clip break-all")}
        >
          <div
            className={cn(
              " inline-block px-2 py-1 rounded-md max-w-[200px] text-sm ",
              {
                "ml-auto bg-blue-500 hover:bg-blue-700 cursor-pointer":
                  message.your,
                "bg-neutral-500 hover:bg-neutral-700 cursor-pointer":
                  !message.your,
              }
            )}
          >
            <div className={cn("p-1")}>
              <a
                href={message.url}
                download={`file.${message.fileType.split("/")[1]}`}
                className="flex flex-col gap-2 items-center"
              >
                <FaDownload />
                <p className="text-xs text-white/50">
                  {message.fileType.split("/")[1].toUpperCase()} FILE
                </p>
              </a>
            </div>
          </div>
        </div>
      );
    }
  }
};
export default renderMesage;
