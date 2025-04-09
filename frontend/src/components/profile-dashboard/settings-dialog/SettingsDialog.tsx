import { useSelector, useDispatch } from "react-redux";
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
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [allInputs, setAllInputs] = useState<MediaDeviceInfo[]>([]);
  const [allOutputs, setAllOutputs] = useState<MediaDeviceInfo[]>([]);
  const [allCameras, setAllCamers] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getMediaDevices = async () => {
      setLoadingSettings(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      devices.forEach((device) => {
        switch (device.kind) {
          case "audioinput":
            setAllInputs(device);
            break;
          case "audiooutput":
            allOutputs.push(device);
            break;
          case "videoinput":
            allCameras.push(device);
            break;
        }
      });
      setLoadingSettings(false);
    };
    getMediaDevices();
  }, [allCameras, allInputs, allOutputs]);

  if (loadingSettings) {
    return <p>loading...</p>;
  }

  return (
    <div>
      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="bg-[#0b0b0b] border-none shadow-md">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center gap-4 ">
              <p>Settings</p>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-row justify-between items-center">
            <InputSelect allInputs={setAllInputs}/>
            <OutputSelect />
          </div>

          <CameraSelect />

          <LowSettingsSwitch />
          <Button
            className="hover:cursor-pointer hover:bg-[#121212]"
            onClick={() => setShowOptions(false)}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsDialog;
