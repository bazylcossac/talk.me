import { UserButton, useUser } from "@clerk/clerk-react";
import VideoIcons from "./VideoIcons";
import ActivityDropdown from "./ActivityDropdown";

function Profile() {
  const user = useUser();

  return (
    <div>
      <div className="bg-[#222222] flex flex-row items-center justify-between rounded-md md:w-[250px] md:p-2 p-4 ">
        <div className="flex flex-row ">
          <div className="relative">
            <div className="flex items-center">
              <UserButton />
            </div>
            <ActivityDropdown />
          </div>

          <div className="ml-2 text-xs md:flex items-center hidden ">
            <p className="md:max-w-[100px] md:truncate select-text">
              {user.user?.username || user.user?.fullName}
            </p>
          </div>
        </div>
        <div className="mx-2">
          <VideoIcons />
        </div>
      </div>
    </div>
  );
}

export default Profile;
