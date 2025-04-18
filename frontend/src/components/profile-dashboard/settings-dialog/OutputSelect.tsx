import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setSelectedOutputDeviceId } from "@/store/slices/webrtc";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

function OutputSelect({ allOutputs }: { allOutputs: MediaDeviceInfo[] }) {
  const allDevices = allOutputs
    ?.filter((device) => device.deviceId !== "")
    .map((device) => device);

  const dispatch = useDispatch();
  const selectedOutputDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedOutputDeviceId
  );

  const handlDeviceChange = (deviceId: string) => {
    dispatch(setSelectedOutputDeviceId(deviceId));
  };

  if (allDevices.length === 0)
    return (
      <div>
        <p className="text-sm mb-2">Select output</p>
        <p>No devices found</p>
      </div>
    );

  return (
    <div>
      <p className="text-sm mb-2">Select output</p>
      <Select
        onValueChange={handlDeviceChange}
        value={selectedOutputDeviceId || "default"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Output" />
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

export default OutputSelect;
