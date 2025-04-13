import { IoIosArrowBack } from "react-icons/io";
import ActiveUser from "./ActiveUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setLeftContainerVisible } from "@/store/slices/user";

function FriendsList() {
  const dispatch = useDispatch();
  const activeUsers = useSelector((state: RootState) => state.user.activeUsers);
  const leftContainerVisible = useSelector(
    (state: RootState) => state.user.leftContainerVisible
  );

  return (
    <div className="bg-[#222222] md:w-[250px] w-full  h-full rounded-md overflow-y-auto scrollbar-hide">
      <div className="p-1 flex items-center gap-4 z-10  bg-[#383838] absolute w-[250px] rounded-t-md">
        <p>Users</p>
        <p> | </p>
        <p>Groups</p>
        <div
          className="ml-auto"
          onClick={() =>
            dispatch(setLeftContainerVisible(!leftContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-1">
            <IoIosArrowBack className="text-lg cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="mt-8">
        {activeUsers?.map((user) => (
          <ActiveUser user={user} key={user.socketId} />
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
