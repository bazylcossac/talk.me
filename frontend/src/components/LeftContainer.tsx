import { IoIosArrowForward } from "react-icons/io";
import FriendsList from "./friends-group-list/FriendsGroupList";
import Profile from "./profile-dashboard/Profile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLeftContainerVisible } from "@/store/slices/app";

function LeftContainer() {
  const dispatch = useDispatch();
  const leftContainerVisible = useSelector(
    (state: RootState) => state.app.leftContainerVisible
  );
  if (!leftContainerVisible)
    return (
      <div
        className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25  cursor-pointer"
        onClick={() => dispatch(setLeftContainerVisible(!leftContainerVisible))}
      >
        <IoIosArrowForward className="text-md" />
      </div>
  );

  return (
    <div className="h-full md:max-w-[250px] w-full flex flex-col gap-4 justify-between animate-fade-right animate-duration-300 ">
      {leftContainerVisible && (
        <>
          <FriendsList />
          <Profile />
        </>
      )}
    </div>
  );
}

export default LeftContainer;
