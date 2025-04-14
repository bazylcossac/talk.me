import { IoIosArrowBack } from "react-icons/io";
import ActiveUser from "./ActiveUser";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setFriendsTableVisible,
  setLeftContainerVisible,
} from "@/store/slices/app";
import { callStatus } from "@/lib/constants";
import ActiveGroup from "./ActiveGroup";

const groupsInfo = [
  {
    roomId: "231321",
    host: {
      imageUrl:
        "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
      username: "dzikidzekson",
      socketId: "321",
      status: callStatus.CALL_IN_PROGRESS,
    },
    users: [
      {
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
        username: "dzikidzekson",
        socketId: "32131232",
        status: callStatus.CALL_IN_PROGRESS,
      },
      {
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
        username: "dzikidzekson",
        socketId: "3213123",
        status: callStatus.CALL_IN_PROGRESS,
      },
    ],
  },
];

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
    <div className="bg-[#222222] md:w-[250px] w-full  h-full rounded-md overflow-y-auto scrollbar-hide">
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
      <div className="mt-8 animate-fade">
        {/* FRIENDS LIST */}
        {friendsTableVisible && (
          <div className="animate-fade animate-duration-300">
            {activeUsers?.map((user) => (
              <ActiveUser user={user} key={user.socketId} />
            ))}
          </div>
        )}
        {/* GROUP LIST */}

        {!friendsTableVisible && (
          <div className="animate-fade animate-duration-300">
            {groupsInfo.map((group) => (
              <ActiveGroup group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendsGroupList;
