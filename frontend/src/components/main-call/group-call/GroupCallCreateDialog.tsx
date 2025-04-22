import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";

import OutputSelect from "../../profile-dashboard/settings-dialog/OutputSelect";
import InputSelect from "../../profile-dashboard/settings-dialog/InputSelect";
import CameraSelect from "../../profile-dashboard/settings-dialog/CameraSelect";
import LowSettingsSwitch from "../../profile-dashboard/settings-dialog/LowSettingsSwitch";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

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
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");

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

  console.log(allOutputs);

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

            <div className="flex flex-col gap-4">
              <label htmlFor="group-name" className="text-xs">
                Group name
              </label>
              <Input
                type="text"
                id="group-password"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
              <label htmlFor="group-name" className="text-xs">
                Group password
              </label>
              <Input
                type="password"
                id="group-password"
                placeholder="Group password"
                value={groupPassword}
                onChange={(e) => setGroupPassword(e.target.value)}
              />
            </div>
            <p className="font-bold">Your devices</p>
            <div className="flex flex-row justify-between items-center">
              <InputSelect allInputs={allInputs} />
              <OutputSelect allOutputs={allOutputs} />
            </div>
            <CameraSelect allCameras={allCameras} />

            <LowSettingsSwitch />
            <Button
              className="hover:cursor-pointer hover:bg-[#121212]"
              onClick={() => setCreateDialogVisible(false)}
            >
              Create Group
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </dialog>
  );
}

export default SettingsDialog;
