import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeInputDevice } from "@/connection/webrtcDevicesFunc";

import { setSelectedCameraDeviceId } from "@/store/slices/webrtc";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

function CameraSelect({ allCameras }: { allCameras: MediaDeviceInfo[] }) {
  const allDevices = allCameras
    ?.filter((device) => device.deviceId !== "")
    .map((device) => device);

  const dispatch = useDispatch();
  const cameraDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedCameraDeviceId
  );

  const handlDeviceChange = (deviceId: string) => {
    dispatch(setSelectedCameraDeviceId(deviceId));
    changeInputDevice(deviceId, "camera");
  };

  if (allDevices.length === 0)
    return (
      <div>
        <p className="text-sm mb-2">Select camera</p>
        <p>No devices found</p>
      </div>
    );

  return (
    <div>
      <p className="text-sm mb-2">Select camera</p>
      <Select
        value={cameraDeviceId || allCameras[0].deviceId}
        onValueChange={handlDeviceChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Camera" />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] text-white ">
          {allDevices?.map((device) => {
            return (
              <SelectItem
                key={device.deviceId}
                value={device.deviceId || "default"}
                className="hover:cursor-pointer hover:bg-[#323232]"
              >
                {device.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CameraSelect;
