import { userDataType } from "@/types/types";


function IncomingCallBox(user: { user: userDataType }) {
  return (
    <div className="bg-[#171717] rounded-md m-2 p-4 flex flex-col">
      <p>Incoming call</p>
      <div className="flex flex-row items-center gap-2 mt-4">
        <img
          src={user.user.imageUrl}
          alt="incoming call user image"
          className="rounded-full size-8"
        />
        <p className="text-md">{user.user.username}</p>
      </div>
    </div>
  );
}

export default IncomingCallBox;
