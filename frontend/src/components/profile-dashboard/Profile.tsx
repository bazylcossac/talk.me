import { UserButton, useUser } from "@clerk/clerk-react";
import { IoMdSettings } from "react-icons/io";
import { BiSolidMicrophone } from "react-icons/bi";
import { HiMiniVideoCamera } from "react-icons/hi2";
// import { HiMiniVideoCameraSlash } from "react-icons/hi2"; CAMERA OFF ICON
// import { BiSolidMicrophoneOff } from "react-icons/bi";  MIC OFF ICON
function Profile() {
  const user = useUser();

  return (
    <div>
      <div className="bg-[#222222] flex flex-row items-center rounded-md w-[250px] p-2">
        <div className="relative">
          <div>
            <UserButton />
          </div>
          <div className="absolute size-3 bg-red-500 rounded-full border-2 border-[#222222] bottom-0 left-4 cursor-pointer hover:bg-red-400"></div>
        </div>

        <div className="ml-2 text-xs">
          <p className="">{user.user?.fullName}</p>
          <p className="text-[#5D5D5D]">Don't disturb</p>
        </div>

        <div className="flex gap-3 ml-10 text-[#cdcdcd] [&>*]:cursor-pointer [&>*]:hover:text-[#f1f1f1]">
          <BiSolidMicrophone />
          <HiMiniVideoCamera />
          <IoMdSettings />
        </div>
      </div>
    </div>
  );
}

export default Profile;
