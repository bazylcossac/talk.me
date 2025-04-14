import { Input } from "@/components/ui/input";
import { Ref } from "react";
import { FaFileExport } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function ChatForm({
  sendMessage,
  formRef,
}: {
  sendMessage: (arg0: FormData) => void;
  formRef: Ref<HTMLFormElement>;
}) {
  return (
    <div className="mt-auto w-full p-2 absolute bottom-0 z-10 bg-[#383838]">
      <form
        action={sendMessage}
        className="flex items-center justify-between gap-2"
        ref={formRef!}
      >
        <FaFileExport className="text-lg hover:text-white/20 cursor-pointer transition " />
        <Input
          className="border-1 border-white/30 focus-visible:ring-0"
          name="messageInput"
        />
        <IoMdSend className="text-xl hover:text-white/30 cursor-pointer transition" />
      </form>
    </div>
  );
}

export default ChatForm;
