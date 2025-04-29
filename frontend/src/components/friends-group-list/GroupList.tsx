import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { RootState } from "@/store/store";
import { callStatus } from "@/lib/constants";
import ActiveGroup from "./ActiveGroup";
import { useState } from "react";
import GroupCallCreateDialog from "../main-call/group-call/GroupCallCreateDialog";

function GroupList({ friendsTableVisible }: { friendsTableVisible: boolean }) {
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const activeGroups = useSelector(
    (state: RootState) => state.user.activeGroups
  );

  const isInGroupCall = useSelector(
    (state: RootState) => state.user.isInGroupCall
  );
  const callState = useSelector((state: RootState) => state.user.userCallState);
  return (
    <>
      {!friendsTableVisible && (
        <section className="animate-fade animate-duration-300">
          <Button
            className="my-4 mx-2 md:my-2 md:mx-2 cursor-pointer hover:bg-neutral-700 p-6 md:p-4"
            onClick={() => setCreateDialogVisible((prev) => !prev)}
            disabled={
              isInGroupCall || callState === callStatus.CALL_IN_PROGRESS
            }
          >
            {isInGroupCall
              ? "In group call"
              : callState === callStatus.CALL_IN_PROGRESS
              ? "In call"
              : "Create group"}
          </Button>
          {activeGroups.map((group) => (
            <ActiveGroup group={group} callState={callState} />
          ))}
          <GroupCallCreateDialog
            createDialogVisible={createDialogVisible}
            setCreateDialogVisible={setCreateDialogVisible}
          />
        </section>
      )}
    </>
  );
}

export default GroupList;
