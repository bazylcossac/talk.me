import { Input } from "@/components/ui/input";
import { Ref, useRef } from "react";
import { FaFileExport } from "react-icons/fa";
import FileInput from "./FileInput";
import { IoMdSend } from "react-icons/io";
import { Button } from "@/components/ui/button";

function ChatForm({
  sendMessage,
  formRef,
}: {
  sendMessage: (arg0: FormData) => void;
  formRef: Ref<HTMLFormElement>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="mt-auto w-full p-2 absolute bottom-0 z-10 bg-[#383838]">
      <form action={sendMessage} className="flex flex-col" ref={formRef!}>
        <FileInput fileRef={fileInputRef} />
        <div className="flex flex-row items-center justify-between gap-2">
          <Button
            className="bg-neutral-600 cursor-pointer"
            onClick={() => {
              fileInputRef.current!.click();
            }}
          >
            <FaFileExport className="text- hover:text-white/20 cursor-pointer transition " />
          </Button>

          <Input
            className="border-1 border-white/30 focus-visible:ring-0"
            name="messageInput"
          />
          <Button className="bg-neutral-600 cursor-pointer">
            <IoMdSend className="text-xl hover:text-white/30 cursor-pointer transition" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatForm;
