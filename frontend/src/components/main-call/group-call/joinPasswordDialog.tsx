import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { joinGroupCall } from "@/connection/webrtcGroupConnection";
import { verifyPassword } from "@/functions/verifyPassword";

import { FormEvent, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";

function PasswordDialog({
  passwordDialogVisible,
  setPasswordDialogVisible,
  roomId,
  peerId,
}: {
  passwordDialogVisible: boolean;
  setPasswordDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  peerId: string;
}) {
  const [passwordInputType, setPasswordInputType] = useState<
    "text" | "password"
  >("password");

  const [passwordValue, setPasswordValue] = useState("");
  const isJoining = useRef(false);

  const handleJoinGroup = async (e: FormEvent) => {
    e.preventDefault();
    const { verified } = await verifyPassword(passwordValue, roomId);
    if (verified && !isJoining.current) {
      isJoining.current = true;
      await joinGroupCall(peerId, roomId);
      isJoining.current = false;
    } else {
      toast.error("Wrong password");
      setPasswordValue("");
    }
    setPasswordDialogVisible(false);
  };

  return (
    <dialog>
      <Dialog
        open={passwordDialogVisible}
        onOpenChange={setPasswordDialogVisible}
      >
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
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
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
              <Button disabled={!passwordValue}>Join</Button>
            </div>
          </form>
        </DialogContent>
        )
      </Dialog>
    </dialog>
  );
}

export default PasswordDialog;
