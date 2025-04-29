import { IoIosArrowForward } from "react-icons/io";
import FriendGroupsList from "./friends-group-list/Friends-GroupList";
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
      <button
        className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25 cursor-pointer hidden md:inline-block"
        onClick={() => dispatch(setLeftContainerVisible(!leftContainerVisible))}
      >
        <IoIosArrowForward className="text-md" />
      </button>
    );

  return (
    <aside className="h-full w-full flex flex-col gap-4 justify-between animate-fade-right animate-duration-300 ">
      {leftContainerVisible && (
        <>
          <FriendGroupsList />
          <Profile />
        </>
      )}
    </aside>
  );
}

export default LeftContainer;
