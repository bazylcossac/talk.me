import { userStatus } from "../../lib/constants";

import { cn } from "@/lib/utils";

function ActiveIcon({
  userActiveStatus,
  className,
}: {
  userActiveStatus: (typeof userStatus)[keyof typeof userStatus];
  className: string;
}) {
  return (
    <div
      className={cn(className, {
        "bg-red-500 hover:bg-red-700":
          userActiveStatus === userStatus.DONT_DISTURB,
        "bg-green-500 hover:bg-green-700":
          userActiveStatus === userStatus.ACTIVE,
        "bg-blue-500 hover:bg-blue-700":
          userActiveStatus === userStatus.IN_CALL,
      })}
    ></div>
  );
}

export default ActiveIcon;
