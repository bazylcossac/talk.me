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

function InputSelect({ allInputs }: { allInputs: MediaDeviceInfo[] }) {
  const dispatch = useDispatch();
  const inputDeviceId = useSelector(
    (state: RootState) => state.webrtc.selectedInputDeviceId
  );

  const handlDeviceChange = (deviceId: string) => {
    dispatch(setSelectedInputDeviceId(deviceId));
  };

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
          {allInputs?.map((device) => {
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

export default InputSelect;
