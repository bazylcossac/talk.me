import { Input } from "@/components/ui/input";
import { Ref, useRef, useState } from "react";
import { FaFileExport } from "react-icons/fa";
import FileInput from "./FileInput";
import { IoMdSend } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { sendMessageDataChannels } from "@/functions/sendMessageDataChannels";
import { toast } from "sonner";
import { ACCEPTED_FILES, MAX_FILE_SIZE } from "@/lib/constants";

function ChatForm({
  sendMessage,
  formRef,
}: {
  sendMessage: (arg0: FormData) => void;
  formRef: Ref<HTMLFormElement>;
}) {
  const { user } = useUser();

  const [fileOver, setFileOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (!user) return;

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer) {
      const file = e.dataTransfer!.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast("Ops! File is to heavy! Try something to 100mb");
        return;
      }
      if (!ACCEPTED_FILES.includes(file.type)) {
        toast("Weird file type! Sorry!");
        return;
      }

      sendMessageDataChannels(file, user);
    }
    setFileOver(false);
  };

  return (
    <section
      className={cn("mt-auto w-full p-2 absolute bottom-0  bg-[#383838]", {
        "border-1 border-black": fileOver,
        "border-none": !fileOver,
      })}
    >
      <div
        className={cn(" flex flex-row w-full gap-2 relative ")}
        onDragEnter={(e) => {
          e.preventDefault();
          setFileOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setFileOver(false);
        }}
      >
        <div
          className={cn(
            "w-full bg-transparent h-full absolute z-100 pointer-events-none",
            {
              "pointer-events-auto": fileOver,
              "pointer-events-none": !fileOver,
            }
          )}
          onDrop={(e) => handleFileDrop(e)}
          onDragOver={(e) => {
            e.preventDefault();
            setFileOver(true);
          }}
        ></div>
        {!fileOver ? (
          <>
            <div>
              <FileInput fileRef={fileInputRef} />
              <Button
                className="bg-neutral-600 cursor-pointer"
                onClick={() => {
                  fileInputRef.current!.click();
                }}
              >
                <FaFileExport className=" hover:text-white/20 cursor-pointer transition " />
              </Button>
            </div>

            <form action={sendMessage} className="flex flex-col" ref={formRef!}>
              <div className="flex flex-row items-center justify-between gap-2 ">
                <Input
                  className="border-1 border-white/30 focus-visible:ring-0 "
                  name="messageInput"
                  type="text"
                />
                <Button className="bg-neutral-600 cursor-pointer">
                  <IoMdSend className="text-xl hover:text-white/30 cursor-pointer transition" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div
            className={cn(
              "flex items-center justify-center bg-[#151515] transition h-[30px] w-full rounded-md border-2 border-dashed border-white/30 "
            )}
          >
            <p className="text-center text-[#7e7e7e]">DROP FILE HERE</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatForm;
