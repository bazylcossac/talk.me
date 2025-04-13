import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import FriendsList from "./friends-list/FriendsList";
import Profile from "./profile-dashboard/Profile";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setLeftContainerVisible } from "@/store/slices/user";

function LeftContainer() {
  const dispatch = useDispatch();
  const leftContainerVisible = useSelector(
    (state: RootState) => state.user.leftContainerVisible
  );
  if (!leftContainerVisible)
    return (
      <div
        className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-1 "
        onClick={() => dispatch(setLeftContainerVisible(!leftContainerVisible))}
      >
        <IoIosArrowForward className="text-lg cursor-pointer" />
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
