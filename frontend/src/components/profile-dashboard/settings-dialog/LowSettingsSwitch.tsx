import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setScreenSharingLowOptions } from "@/store/slices/user";
import { Switch } from "@/components/ui/switch";
import { changeScreenSharingResolution } from "@/connection/webrtcDevicesFunc";

function LowSettingsSwitch() {
  const dispatch = useDispatch();
  const lowQualityMode = useSelector(
    (state: RootState) => state.user.screenSharingLowOptions
  );

  const handleQualitySharingChange = (checked: boolean) => {
    dispatch(setScreenSharingLowOptions(checked));
    changeScreenSharingResolution();
  };
  return (
    <div>
      <p className="text-sm">Low quality screen sharing</p>
      <p className="text-[10px] text-white/30 mb-2">
        Recommended for bad internet connection
      </p>
      <Switch
        aria-readonly
        onCheckedChange={handleQualitySharingChange}
        checked={lowQualityMode}
      />
    </div>
  );
}

export default LowSettingsSwitch;
