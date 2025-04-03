import { useSelector } from "react-redux";
import { userSatus } from "../../lib/constants";

import { RootState } from "../../store/store";
import { cn } from "@/lib/utils";

function ActiveIcon() {
  const userActiveStatus = useSelector(
    (state: RootState) => state.user.userActiveStatus
  );
  console.log(userActiveStatus);
  return (
    <div
      className={cn(
        "hidden md:inline-block size-3 rounded-full border-2 border-[#222222] cursor-pointer outline-none ",
        {
          "bg-red-500 hover:bg-red-700":
            userActiveStatus === userSatus.DONT_DISTURB,
          "bg-green-500 hover:bg-green-700":
            userActiveStatus === userSatus.ACTIVE,
          "bg-blue-500 hover:bg-blue-700":
            userActiveStatus === userSatus.IN_CALL,
        }
      )}
    ></div>
  );
}

export default ActiveIcon;
