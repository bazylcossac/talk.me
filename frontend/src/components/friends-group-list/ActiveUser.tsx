import { useDispatch } from "react-redux";
import { BsCameraVideoFill } from "react-icons/bs";
import { userDataType } from "@/types/types";
import { callToUser } from "@/connection/webrtcConnection";
import ActiveIcon from "../profile-dashboard/ActiveIcon";
import { setCalleData } from "@/store/slices/user";

function ActiveUser({ user }: { user: userDataType }) {
  const dispatch = useDispatch();
  const handleCallToUser = (calleSocketId: string) => {
    dispatch(setCalleData(user));
    callToUser(calleSocketId);
  };

  return (
    <div className="select-none">
      <div className="flex flex-row items-center justify-between rounded-md md:w-[250px] p-4 md:p-2 ">
        <div className="flex flex-row">
          <div className="">
            <div className="flex items-center relative">
              <img
                src={user.imageUrl}
                alt={`${user.username}'s profile image`}
                className=" rounded-full size-7"
              />
              <div className="absolute -bottom-2 left-[18px] focus:ring-0 focus:outline-none">
                <ActiveIcon
                  userActiveStatus={user.status}
                  className="hidden md:inline-block size-3 rounded-full border-2 border-[#222222] cursor-pointer outline-none"
                />
              </div>
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
          onClick={() => handleCallToUser(user.socketId)}
        >
          <BsCameraVideoFill className="text-[#9C9C9C] md:text-sm" />
        </div>
      </div>
    </div>
  );
}

export default ActiveUser;
