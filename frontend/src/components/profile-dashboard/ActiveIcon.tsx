import { useSelector } from "react-redux";
import { userSatus } from "../../utils/constants";
import cn from "../../utils/cn";
import { RootState } from "../../store/store";

function ActiveIcon() {
  const userActiveStatus = useSelector(
    (state: RootState) => state.user.userActiveStatus
  );
  console.log(userActiveStatus);
  return (
    <div
      className={cn(
        "hidden md:inline-block absolute size-3 rounded-full border-2 border-[#222222] -bottom-1 left-[18px] cursor-pointer ",
        {
          "bg-red-500 hover:bg-red-700":
            userActiveStatus === userSatus.DONT_DISTURB,
          "bg-green-500 hover:bg-green-700":
            userActiveStatus === userSatus.ACTIVE,
          "bg-blue-500 hover:bg-blue-700":
            userActiveStatus === userSatus.IN_CALL,
        }
      )}
    ></div>
  );
}

export default ActiveIcon;
