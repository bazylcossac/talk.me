import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function OutputSelect({ allOutputs }: { allOutputs: MediaDeviceInfo[] }) {
  return (
    <div>
      <p className="text-sm mb-2">Select output</p>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent className="bg-[#121212] text-white ">
          {allOutputs?.map((device) => {
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

export default OutputSelect;
