import { userDataType } from "@/types/types";
import { Button } from "../ui/button";

function IncomingCallBox(user: { user: userDataType }) {
  return (
    <div className="bg-[#171717] rounded-md m-2 p-4 flex flex-col">
      <p>Incoming call</p>
      <div className="flex flex-row items-center gap-2 mt-4">
        <img
          src={user.user.imageUrl}
          alt="incoming call user image"
          className="rounded-full size-6"
        />
        <p className="text-xs">{user.user.username}</p>
      </div>

      <div className="flex flex-row items-center gap-4  mt-4 [&>*]:cursor-pointer">
        <Button
          variant="secondary"
          className="bg-green-500 text-white hover:bg-green-700 text-xs"
        >
          Accept
        </Button>
        <Button variant="destructive" className="hover:bg-red-700 text-xs">
          Decline
        </Button>
      </div>
    </div>
  );
}

export default IncomingCallBox;
