import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleKickUser } from "@/connection/webrtcGroupConnection";
import { userDataType } from "@/types/types";

function UsersSettingsDialog({
  showSettings,
  setShowSettings,
  user,
}: {
  showSettings: boolean;
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>;
  user: userDataType;
}) {
  const kickUser = () => {
    handleKickUser(user.socketId!);
  };

  return (
    <dialog>
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-[#0b0b0b] border-none shadow-md">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center gap-4 ">
              <p className="text-lg ">
                {user.username} <span className="font-medium ">settings</span>
              </p>
            </DialogTitle>

            <Button onClick={kickUser} variant="destructive">
              Kick
            </Button>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </dialog>
  );
}

export default UsersSettingsDialog;
