import { callStatus } from "@/lib/constants";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import IncomingCallBox from "./IncomingCallBox";

// const callingData = [
//   {
//     username: "dzikidzekson",
//     imageUrl:
//       "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18ydkRKTWR3UTZ3ZjA0OTVWMzVjVjFIQ2YxdHEifQ",
//     status: callStatus.CALL_AVAILABLE,
//     socketId: "10",
//   },
// ];

function IncomingCallContainer() {
  const callingUsersData = useSelector(
    (state: RootState) => state.webrtc.callingUsersData
  );

  return (
    <div className="fixed w-full h-[150px] md:w-[250px] md:h-full  top-0 right-0 z-100 overflow-y-auto custom-scrollbar">
      {callingUsersData?.map((user) => (
        <IncomingCallBox user={user} />
      ))}
    </div>
  );
}

export default IncomingCallContainer;
