import { IoIosArrowBack } from "react-icons/io";
import ActiveUser from "./ActiveUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setFriendsTableVisible,
  setLeftContainerVisible,
} from "@/store/slices/app";
import GroupList from "./GroupList";

function FriendsGroupList() {
  const dispatch = useDispatch();
  const activeUsers = useSelector((state: RootState) => state.user.activeUsers);
  const leftContainerVisible = useSelector(
    (state: RootState) => state.app.leftContainerVisible
  );

  const friendsTableVisible = useSelector(
    (state: RootState) => state.app.friendsTableVisible
  );

  return (
    <section className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide">
      <div className="p-1 flex items-center gap-4 z-10 bg-[#383838] absolute md:w-[250px] w-full rounded-t-md">
        <p
          className={`text-lg md:text-xs ml-4 md:ml-2 cursor-pointer hover:text-white transition ${
            friendsTableVisible ? "text-white" : "text-white/40"
          }`}
          onClick={() => dispatch(setFriendsTableVisible(true))}
        >
          Users
        </p>
        <p
          className={`text-lg md:text-xs ml-4 md:ml-2 cursor-pointer hover:text-white transition ${
            !friendsTableVisible ? "text-white" : "text-white/40"
          }`}
          onClick={() => dispatch(setFriendsTableVisible(false))}
        >
          Groups
        </p>
        <div
          className="ml-auto"
          onClick={() =>
            dispatch(setLeftContainerVisible(!leftContainerVisible))
          }
        >
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25 cursor-pointer hidden md:inline-block">
            <IoIosArrowBack className="text-md" />
          </div>
        </div>
      </div>
      <nav className="mt-8 animate-fade">
        {/* FRIENDS LIST */}
        {friendsTableVisible && (
          <section className="animate-fade animate-duration-300">
            {activeUsers?.map((user) => (
              <ActiveUser user={user} key={user.socketId} />
            ))}
          </section>
        )}
        {/* GROUP LIST */}
        <GroupList friendsTableVisible={friendsTableVisible} />
      </nav>
    </section>
  );
}

export default FriendsGroupList;
