import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { joinGroupCall } from "@/connection/webrtcGroupConnection";
import { useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function PasswordDialog({
  passwordDialogVisible,
  setPasswordDialogVisible,
}: {
  passwordDialogVisible: boolean;
  setPasswordDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [passwordInputType, setPasswordInputType] = useState<
    "text" | "password"
  >("password");

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleJoinGroup = async () => {

    
    // await joinGroupCall(group.peerId, group.roomId);
  };

  return (
    <dialog>
      <Dialog
        open={passwordDialogVisible}
        onOpenChange={setPasswordDialogVisible}
      >
        {!passwordDialogVisible && (
          <DialogContent className="bg-[#0b0b0b] border-none shadow-md">
            <DialogHeader>
              <DialogTitle className="flex flex-row items-center gap-4 ">
                <p>Create group</p>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinGroup}>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label htmlFor="group-password" className="text-xs">
                    Group password
                  </label>
                  <Input
                    type={passwordInputType}
                    id="group-password"
                    placeholder="Group password"
                    name="group-password"
                    ref={passwordInputRef}
                  />
                  <button
                    onClick={() =>
                      setPasswordInputType((prev) =>
                        prev === "password" ? "text" : "password"
                      )
                    }
                  >
                    {passwordInputType === "password" ? (
                      <FaRegEyeSlash className="absolute right-4 top-8.5 text-white/70 hover:text-white  cursor-pointer" />
                    ) : (
                      <FaRegEye className="absolute right-4 top-8.5 text-white/70 hover:text-white cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </dialog>
  );
}

export default PasswordDialog;
