import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActiveIcon from "./ActiveIcon";
import { useSelector } from "react-redux";
import { userStatus } from "@/lib/constants";

import store, { RootState } from "@/store/store";
import { handleUserActiveChange } from "@/connection/webSocketConnection";
import { setCallingUserData } from "@/store/slices/webrtc";

function ActivityDropdown() {
  const userActiveStatus = useSelector(
    (state: RootState) => state.user.userActiveStatus
  );
  return (
    <div className="absolute -bottom-2 left-[18px] focus:ring-0 focus:outline-none">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <ActiveIcon
            userActiveStatus={userActiveStatus}
            className="hidden md:inline-block size-3 rounded-full border-2 border-[#222222] cursor-pointer outline-none "
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-[#101010] border-none ml-5 mb-2 [&>*]:text-xs [&>*]:hover:bg-[#494949] [&>*]:hover:text-white [&>*]:cursor-pointer "
          side="top"
        >
          <DropdownMenuItem
            className="flex text-white"
            onClick={() => {
              handleUserActiveChange(userStatus.DONT_DISTURB);
            }}
          >
            <div className="bg-red-500 size-2 rounded-full"></div>
            Do not disturb
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex text-white"
            onClick={() => {
              handleUserActiveChange(userStatus.ACTIVE);
              store.dispatch(setCallingUserData([]));
            }}
          >
            <div className="bg-green-500 size-2 rounded-full"></div>
            Active
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex text-white"
            onClick={() => {
              handleUserActiveChange(userStatus.IN_CALL);
            }}
          >
            <div className="bg-blue-500 size-2 rounded-full"></div>
            In call
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ActivityDropdown;
