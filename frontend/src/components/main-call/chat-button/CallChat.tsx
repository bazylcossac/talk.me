import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { IoIosArrowForward, IoMdSend } from "react-icons/io";
import { setRightContainerVisible } from "@/store/slices/app";
import { RootState } from "@/store/store";
function CallChat() {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const rightContainerVisible = useSelector(
    (state: RootState) => state.app.rightContainerVisible
  );
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    formRef!.current!.reset();
  };

  return (
    <div className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide flex">
      <div className="p-1 flex items-center gap-4 z-10  bg-[#383838] absolute w-[250px] rounded-t-md">
        <div
          className="ml-auto"
          onClick={() =>
            dispatch(setRightContainerVisible(!rightContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25">
            <IoIosArrowForward className="text-md cursor-pointer" />
          </div>
        </div>
      </div>
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
