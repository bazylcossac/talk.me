import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";
import { Button } from "../ui/button";

function SettingsDialog({
  showOptions,
  setShowOptions,
}: {
  showOptions: boolean;
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
            <div>
              <p className="text-sm mb-2">Select input</p>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] text-white ">
                  <SelectItem value="light" className="hover:cursor-pointer">
                    Light
                  </SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-sm mb-2">Select output</p>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="bg-[#121212] text-white ">
                  <SelectItem value="light" className="hover:cursor-pointer">
                    Light
                  </SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-sm mb-2">Select camera</p>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] text-white ">
                <SelectItem value="light" className="hover:cursor-pointer">
                  Light
                </SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm">Low quality screen sharing</p>
            <p className="text-[10px] text-white/30 mb-2">
              Recommended for bad internet connection
            </p>
            <Switch aria-readonly />
          </div>
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
