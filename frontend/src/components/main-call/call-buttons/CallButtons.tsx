import { IoClose } from "react-icons/io5";
import { LuScreenShare } from "react-icons/lu";

function CallButtons({ className }: { className: string }) {
  return (
    <div className={className}>
      <LuScreenShare className="text-blue-500 bg-blue-300 hover:text-blue-300 hover:bg-blue-500  rounded-full p-1.75" />
      <IoClose className="text-red-700 bg-red-400 hover:text-red-400 hover:bg-red-700  rounded-full p-1.75" />
    </div>
  );
}

export default CallButtons;
