import { setLocalCameraHide } from "@/store/slices/webrtc";
import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";

function HideLocalCameraBtn() {
  const dispatch = useDispatch();
  const isLocalCameraHide = useSelector(
    (state: RootState) => state.webrtc.localCameraHide
  );

  const handleLocalCameraHide = () => {
    dispatch(setLocalCameraHide(!isLocalCameraHide));
  };

  return (
    <div
      className="absolute top-0 cursor-pointer"
      onClick={handleLocalCameraHide}
    >
      X
    </div>
  );
}

export default HideLocalCameraBtn;
