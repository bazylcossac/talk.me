import { useState } from "react";
import { Button } from "../ui/button";
import Logo from "../Logo";
import GroupCallCreateDialog from "./group-call/GroupCallCreateDialog";

function MainCallContNoCall() {
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  return (
    <>
      <div className="absolute right-0 mr-4">
        <Logo className="w-20" />
      </div>
      <div className="flex flex-col h-full  items-center justify-center gap-2 fixed right-1/2 transform translate-x-1/2">
        <p className="text-white/30 font-bold">Call someone</p>
        <p className="text-white/30 ">or</p>
        <Button
          className="hover:cursor-pointer hover:bg-[#303030]"
          onClick={() => setCreateDialogVisible(true)}
        >
          Start group call
        </Button>
      </div>

      <GroupCallCreateDialog
        createDialogVisible={createDialogVisible}
        setCreateDialogVisible={setCreateDialogVisible}
      />
    </>
  );
}

export default MainCallContNoCall;
