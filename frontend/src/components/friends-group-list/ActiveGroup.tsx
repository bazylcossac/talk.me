import { useSelector } from "react-redux";
import { joinGroupCall } from "@/connection/webrtcGroupConnection";
import { cn } from "@/lib/utils";
import { GroupCallDataType } from "@/types/types";
import { RxEnter } from "react-icons/rx";
import { RootState } from "@/store/store";
import { callStatus } from "@/lib/constants";
import { FaLock } from "react-icons/fa6";
import { useRef, useState } from "react";
import PasswordDialog from "../main-call/group-call/joinPasswordDialog";
function ActiveGroup({
  group,
  callState,
}: {
  group: GroupCallDataType;
  callState: (typeof callStatus)[keyof typeof callStatus];
}) {
  const isInGroupCall = useSelector(
    (state: RootState) => state.user.isInGroupCall
  );
  const isJoining = useRef(false);
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);

  return (
    <section className="p-2">
      <p className="text-[10px] text-white/30">{group.users.length + 1}/4</p>
      <div className="flex items-center gap-2">
        <p className="text-sm  max-w-[220px] truncate">{group.groupName}</p>
        {group.groupPassword && <FaLock className="text-neutral-600 text-xs" />}
      </div>
      <div className="flex flex-row justify-between relative h-8 mt-1">
        <div className="flex flex-row">
          <img
            src={group.hostUser.imageUrl}
            alt="host image"
            className="size-8 rounded-full relative z-100 border-2 border-[#222222]"
          />
          {group.users.map((user, index) => (
            <img
              src={user.imageUrl}
              alt={`${user.username}'s image`}
              className="size-8 rounded-full absolute border-2 border-[#222222] "
              style={{
                left: `${(index + 1) * 25}px`,
                zIndex: 50 - (index + 1),
              }}
            />
          ))}
        </div>
        {!isInGroupCall && (
          <div>
            <button
              onClick={() => {
                if (!isJoining.current) {
                  if (group.groupPassword) {
                    setPasswordDialogVisible(true);
                    isJoining.current = true;
                  } else {
                    joinGroupCall(group.peerId, group.roomId);
                    isJoining.current = true;
                  }
                }
              }}
              className={cn(
                "bg-[#333333] p-2 rounded-md cursor-pointer hover:bg-[#222222]",
                {
                  hidden: group.users.length + 1 === 4,
                }
              )}
              disabled={
                callState === callStatus.CALL_IN_PROGRESS ||
                callState === callStatus.CALL_REQUESTED
              }
            >
              <RxEnter />
            </button>
            <PasswordDialog
              passwordDialogVisible={passwordDialogVisible}
              setPasswordDialogVisible={setPasswordDialogVisible}
              roomId={group.roomId}
              peerId={group.peerId}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ActiveGroup;
