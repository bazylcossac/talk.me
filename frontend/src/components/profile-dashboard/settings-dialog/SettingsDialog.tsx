import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../../ui/button";

import OutputSelect from "./OutputSelect";
import InputSelect from "./InputSelect";
import CameraSelect from "./CameraSelect";
import LowSettingsSwitch from "./LowSettingsSwitch";
import { useEffect, useState } from "react";

function SettingsDialog({
  showOptions,
  setShowOptions,
}: {
  showOptions: boolean;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [allDevices, setAllDevices] = useState<MediaDeviceInfo[]>([]);
  const [allInputs, setAllInputs] = useState<MediaDeviceInfo[]>([]);
  const [allOutputs, setAllOutputs] = useState<MediaDeviceInfo[]>([]);
  const [allCameras, setAllCamers] = useState<MediaDeviceInfo[]>([]);

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

  return (
    <dialog>
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        {!loadingSettings && (
          <DialogContent className="bg-[#0b0b0b] border-none shadow-md">
            <DialogHeader>
              <DialogTitle className="flex flex-row items-center gap-4 ">
                <p>Settings</p>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-row justify-between items-center">
              <InputSelect allInputs={allInputs} />
              <OutputSelect allOutputs={allOutputs} />
            </div>

            <CameraSelect allCameras={allCameras} />

            <LowSettingsSwitch />
            <Button
              className="hover:cursor-pointer hover:bg-[#121212]"
              onClick={() => setShowOptions(false)}
            >
              Save
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </dialog>
  );
}

export default SettingsDialog;
