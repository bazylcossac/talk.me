import { userStatus } from "@/lib/constants";
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
  {
    username: "dzikidzekson",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
    status: userStatus.DONT_DISTURB,
    socketId: "22",
  },
  {
    username: "legoprogrammer23321312321123321321312321312312321312312",
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
    status: userStatus.IN_CALL,
    socketId: "21",
  },
];

function FriendsList() {
  return (
    <div className="bg-[#222222] md:w-[250px] :w-full h-full rounded-md overflow-y-auto scrollbar-hide ">
      {users?.map((user) => (
        <ActiveUser user={user} key={user.socketId} />
      ))}
    </div>
  );
}

export default FriendsList;
