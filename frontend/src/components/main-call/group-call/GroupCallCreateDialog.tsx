import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Button } from "../../ui/button";

import OutputSelect from "../../profile-dashboard/settings-dialog/OutputSelect";
import InputSelect from "../../profile-dashboard/settings-dialog/InputSelect";
import CameraSelect from "../../profile-dashboard/settings-dialog/CameraSelect";
import LowSettingsSwitch from "../../profile-dashboard/settings-dialog/LowSettingsSwitch";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { createGroupCall } from "@/connection/webrtcGroupConnection";

function SettingsDialog({
  createDialogVisible,
  setCreateDialogVisible,
}: {
  createDialogVisible: boolean;
  setCreateDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [allDevices, setAllDevices] = useState<MediaDeviceInfo[]>([]);
  const [allInputs, setAllInputs] = useState<MediaDeviceInfo[]>([]);
  const [allOutputs, setAllOutputs] = useState<MediaDeviceInfo[]>([]);
  const [allCameras, setAllCamers] = useState<MediaDeviceInfo[]>([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const [passwordInputType, setPasswordInputType] = useState<
    "text" | "password"
  >("password");

  const nameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setAllDevices(devices);
      setLoadingSettings(false);
    };
    getMediaDevices();
  }, []);

  useEffect(() => {
    allDevices.forEach((device) => {
      switch (device.kind) {
        case "audioinput":
          setAllInputs((prev) => [...prev, device]);
          break;
        case "audiooutput":
          setAllOutputs((prev) => [...prev, device]);
          break;
        case "videoinput":
          setAllCamers((prev) => [...prev, device]);
          break;
      }
    });
  }, [allDevices]);

  const handleCreateGroup = async (e: FormEvent) => {
    setCreatingGroup(true);
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const groupName = formData.get("group-name") as string;
    const groupPassword = formData.get("group-password") as string | null;

    await createGroupCall(groupName, groupPassword);
    setCreateDialogVisible(false);
    setCreatingGroup(false);
  };

  return (
    <dialog>
      <Dialog open={createDialogVisible} onOpenChange={setCreateDialogVisible}>
        {!loadingSettings && (
          <DialogContent className="bg-[#0b0b0b] border-none shadow-md">
            <DialogHeader>
              <DialogTitle className="flex flex-row items-center gap-4 ">
                <p>Create group</p>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroup}>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="group-name" className="text-xs">
                    Group name
                  </label>
                  <Input
                    type="text"
                    id="group-name"
                    name="group-name"
                    placeholder="Group name"
                    ref={nameInputRef}
                    required
                  />
                </div>
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
              <p className="font-bold">Your devices</p>
              <div className="flex flex-row justify-between items-center">
                <InputSelect allInputs={allInputs} />
                <OutputSelect allOutputs={allOutputs} />
              </div>
              <CameraSelect allCameras={allCameras} />

              <LowSettingsSwitch />
              <Button
                className="hover:cursor-pointer hover:bg-[#121212] mt-4 w-full"
                type="submit"
                disabled={creatingGroup}
              >
                {creatingGroup ? "Creating..." : "Create Group"}
              </Button>
            </form>
          </DialogContent>
        )}
      </Dialog>
    </dialog>
  );
}

export default SettingsDialog;
