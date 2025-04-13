import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { IoMdSend } from "react-icons/io";
function CallChat() {
  const formRef = useRef<HTMLFormElement>(null);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    formRef!.current!.reset();
  };

  return (
    <div className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide flex">
      <div className="mt-auto w-full p-2">
        <form
          onSubmit={sendMessage}
          className="flex items-center justify-between gap-2"
          ref={formRef}
        >
          <Input className="border-1 border-white/30" />
          <IoMdSend className="text-xl hover:text-white/30 cursor-pointer" />
        </form>
      </div>
    </div>
  );
}

export default CallChat;
