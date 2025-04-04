import { cn } from "@/lib/utils";
import { userStatus } from "../../lib/constants";

type ActiveUserT = {
  username: string;
  imageUrl: string;
  status: string;
  socketId: string;
};

function ActiveUser({ user }: { user: ActiveUserT }) {
  return (
    <div>
      <div className="bg-[#222222] flex flex-row items-center md:justify-between  rounded-md md:w-[250px] md:p-2 p-4 ">
        <div className="flex flex-row ">
          <div className="">
            <div className="flex items-center relative">
              <img
                src={user.imageUrl}
                alt={`${user.username}'s profile image`}
                className=" rounded-full size-8 "
              />
              <div
                className={cn(
                  "hidden md:inline-block size-3 rounded-full border-2 border-[#222222]  outline-none absolute -bottom-1 right-0",
                  {
                    "bg-red-500": user.status === userStatus.DONT_DISTURB,
                    "bg-green-500": user.status === userStatus.ACTIVE,
                    "bg-blue-500": user.status === userStatus.IN_CALL,
                  }
                )}
              ></div>
            </div>
          </div>

          <div className="ml-2 text-xs md:flex items-center hidden ">
            <p className="md:max-w-[100px] md:truncate select-none">
              {user.username}
            </p>
          </div>
        </div>
        <button onClick={() => console.log(user.socketId)}></button>
        {/* call button */}
      </div>
    </div>
  );
}

export default ActiveUser;
