import ActiveUser from "./ActiveUser";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function FriendsList() {
  const activeUsers = useSelector((state: RootState) => state.user.activeUsers);

  return (
    <div className="bg-[#222222] md:w-[250px] w-full h-full rounded-md overflow-y-auto scrollbar-hide ">
      {activeUsers?.map((user) => (
        <ActiveUser user={user} key={user.socketId} />
      ))}
    </div>
  );
}

export default FriendsList;
