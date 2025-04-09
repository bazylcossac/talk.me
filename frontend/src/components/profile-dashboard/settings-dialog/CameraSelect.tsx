import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CameraSelect({ allCameras }: { allCameras: MediaDeviceInfo[] }) {
  return (
    <div>
      <p className="text-sm mb-2">Select camera</p>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
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
