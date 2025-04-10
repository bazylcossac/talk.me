import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RootState } from "@/store/store";
import { setSelectedInputDeviceId } from "@/store/slices/webrtc";
import { changeInputDevice } from "@/connection/webrtcConnection";

function InputSelect({ allInputs }: { allInputs: MediaDeviceInfo[] }) {
  const allDevices = allInputs
    ?.filter((device) => device.deviceId !== "")
    .map((device) => device);

  const dispatch = useDispatch();
  const inputDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedInputDeviceId
  );

  const handlDeviceChange = (deviceId: string) => {
    dispatch(setSelectedInputDeviceId(deviceId));
    changeInputDevice(deviceId, "input");
  };

  if (allDevices.length === 0)
    return (
      <div>
        <p className="text-sm mb-2">Select input</p>
        <p>No devices found</p>
      </div>
    );

  return (
    <div>
      <p className="text-sm mb-2">Select input</p>
      <Select
        onValueChange={handlDeviceChange}
        value={inputDeviceId || "default"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Input" />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] text-white ">
          {allDevices.map((device) => {
            return (
              <SelectItem
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

export default InputSelect;
