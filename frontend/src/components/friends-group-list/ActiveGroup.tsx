import { cn } from "@/lib/utils";
import { ActiveGroupType } from "@/types/types";
import { RxEnter } from "react-icons/rx";

function ActiveGroup({ group }: { group: ActiveGroupType }) {
  return (
    <div className="p-2">
      <p className="text-[10px] text-white/30">{group.users.length + 1}/4</p>
      <p className="text-sm">{group.host.username}'s group</p>
      <div className="flex flex-row justify-between relative h-8 mt-1">
        <div className="flex flex-row">
          <img
            src={group.host.imageUrl}
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
        <div
          className={cn(
            "bg-[#333333] p-2 rounded-md cursor-pointer hover:bg-[#222222]",
            {
              hidden: group.users.length + 1 === 4,
            }
          )}
        >
          <RxEnter />
        </div>
      </div>
    </div>
  );
}

export default ActiveGroup;
