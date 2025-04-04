import { userStatus } from "@/lib/constants";
import { useUser } from "@clerk/clerk-react";
import ActiveUser from "./ActiveUser";

/// https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ
/// BazylCossac

const users = [
  {
    username: "BazylCossac",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
    status: userStatus.ACTIVE,
    socketId: "2",
  },
];

function FriendsList() {
  const user = useUser();
  console.log(user.user?.fullName);

  return (
    <div className="bg-[#222222] md:w-[250px] :w-full h-full  rounded-md">
      {users?.map((user) => (
        <ActiveUser user={user} key={user.socketId} />
      ))}
    </div>
  );
}

export default FriendsList;
