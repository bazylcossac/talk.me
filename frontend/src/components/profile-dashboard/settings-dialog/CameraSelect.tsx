import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedCameraDeviceId } from "@/store/slices/webrtc";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

function CameraSelect({ allCameras }: { allCameras: MediaDeviceInfo[] }) {
  const dispatch = useDispatch();
  const cameraDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedCameraDeviceId
  );

  const handlDeviceChange = (deviceId: string) => {
    dispatch(setSelectedCameraDeviceId(deviceId));
  };

  return (
    <div>
      <p className="text-sm mb-2">Select camera</p>
      <Select
        value={
          allCameras.length === 1 ? allCameras[0].deviceId : cameraDeviceId
        }
        onValueChange={handlDeviceChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Camera" />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] text-white ">
          {allCameras?.map((device) => {
            return (
              <SelectItem
                value={device.deviceId}
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
