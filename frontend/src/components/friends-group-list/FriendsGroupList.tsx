import { IoIosArrowBack } from "react-icons/io";
import ActiveUser from "./ActiveUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setFriendsTableVisible,
  setLeftContainerVisible,
} from "@/store/slices/app";

import ActiveGroup from "./ActiveGroup";
import { Button } from "../ui/button";
import { createGroupCall } from "@/connection/webrtcGroupConnection";

function FriendsGroupList() {
  const dispatch = useDispatch();
  const activeUsers = useSelector((state: RootState) => state.user.activeUsers);
  const leftContainerVisible = useSelector(
    (state: RootState) => state.app.leftContainerVisible
  );
  const activeGroups = useSelector(
    (state: RootState) => state.user.activeGroups
  );
  const friendsTableVisible = useSelector(
    (state: RootState) => state.app.friendsTableVisible
  );

  const hasCreatedGroupCall = useSelector(
    (state: RootState) => state.user.hasCreatedGroupCall
  );

  return (
    <section className="bg-[#222222] md:w-[250px] w-full  h-full rounded-md overflow-y-auto scrollbar-hide">
      <div className="p-1 flex items-center gap-4 z-10 bg-[#383838] absolute w-[250px] rounded-t-md">
        <p
          className={`text-xs  ml-2 cursor-pointer hover:text-white transition ${
            friendsTableVisible ? "text-white" : "text-white/40"
          }`}
          onClick={() => dispatch(setFriendsTableVisible(true))}
        >
          Users
        </p>
        <p
          className={`text-xs  ml-2 cursor-pointer hover:text-white transition ${
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
          <div className="bg-[#222222] hover:bg-[#333333] hover:text-[#888888] rounded-sm p-0.25 cursor-pointer">
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

        {!friendsTableVisible && (
          <section className="animate-fade animate-duration-300">
            <Button
              className="m-1 cursor-pointer hover:bg-neutral-700"
              onClick={createGroupCall}
              disabled={hasCreatedGroupCall}
            >
              {hasCreatedGroupCall ? "In group call" : "Create group"}
            </Button>
            {activeGroups.map((group) => (
              <ActiveGroup group={group} />
            ))}
          </section>
        )}
      </nav>
    </section>
  );
}

export default FriendsGroupList;
