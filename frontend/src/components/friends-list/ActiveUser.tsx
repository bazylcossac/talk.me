import { cn } from "@/lib/utils";
import { userStatus } from "../../lib/constants";
import { BsCameraVideoFill } from "react-icons/bs";
import { userDataType } from "@/types/types";
// type ActiveUserT = {
//   username: string;
//   imageUrl: string;
//   status: string;
//   socketId: string;
// };

function ActiveUser({ user }: { user: userDataType }) {
  return (
    <div className="select-none">
      <div className="flex flex-row items-center justify-between rounded-md md:w-[250px] p-4 md:p-3 ">
        <div className="flex flex-row">
          <div className="">
            <div className="flex items-center relative">
              <img
                src={user.imageUrl}
                alt={`${user.username}'s profile image`}
                className=" rounded-full size-7"
              />
              <div
                className={cn(
                  "inline-block size-3 rounded-full border-2 border-[#222222]  outline-none absolute -bottom-1 right-0",
                  {
                    "bg-red-500": user.status === userStatus.DONT_DISTURB,
                    "bg-green-500": user.status === userStatus.ACTIVE,
                    "bg-blue-500": user.status === userStatus.IN_CALL,
                  }
                )}
              ></div>
            </div>
          </div>

          <div className="ml-2 md:text-xs flex items-center justifty-center ">
            <p className="max-w-[130px] overflow-y-hidden select-text scrollbar-hide">
              {user.username}
            </p>
          </div>
        </div>
        <div
          className="bg-[#333333] p-2 rounded-md cursor-pointer hover:bg-[#222222] "
          onClick={() => console.log(user.socketId)}
        >
          <BsCameraVideoFill className="text-[#9C9C9C] md:text-sm" />
        </div>
      </div>
    </div>
  );
}

export default ActiveUser;
