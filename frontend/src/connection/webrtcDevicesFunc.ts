import {
  callStatus,
  screenSharingHighQualityOptions,
  screenSharingLowQualityOptions,
} from "@/lib/constants";
import { setScreenSharingEnabled } from "@/store/slices/user";
import store from "@/store/store";
import { peerConnection, setUpLocalStream } from "./webrtcConnection";
import { toast } from "sonner";
import {
  setGroupCallUsers,
  setLocalStream,
  setNewGroupCallUsers,
  setScreenSharingScreen,
} from "@/store/slices/webrtc";
import { currentGroupId, myPeerId } from "./webrtcGroupConnection";

export const handleScreenSharing = async (
  screenSharingEnabled: boolean
): Promise<void> => {
  if (screenSharingEnabled) {
    try {
      const isLowMedia = store.getState().user.screenSharingLowOptions;

      const qualityMode = isLowMedia
        ? screenSharingLowQualityOptions
        : screenSharingHighQualityOptions;

      const screenSharingStream = await navigator.mediaDevices.getDisplayMedia(
        qualityMode
      );
      store.dispatch(setScreenSharingScreen(screenSharingStream));
      const senders = await peerConnection!.getSenders();

      const sender = senders.find(
        (sender) =>
          sender.track!.kind === screenSharingStream.getVideoTracks()[0].kind
      );

      if (!sender) {
        toast("Failed to screern share");
        return;
      }
      sender.replaceTrack(screenSharingStream.getVideoTracks()[0]);
    } catch (err) {
      const error = err as Error;
      toast(error.message);
      store.dispatch(setScreenSharingEnabled(false));
    }
  } else if (!screenSharingEnabled) {
    const localStream = store.getState().webrtc.localStream;
    if (!localStream) {
      setUpLocalStream();
    }
    const senders = await peerConnection!.getSenders();

    const sender = senders.find(
      (sender) => sender.track!.kind === localStream?.getVideoTracks()[0].kind
    );

    if (!sender) {
      toast("Failed to switch back to camera");
      return;
    }

    sender.replaceTrack(localStream!.getVideoTracks()[0]);
    store.dispatch(setScreenSharingScreen(null));
  }
};

export const changeScreenSharingResolution = async () => {
  const callState = store.getState().user.userCallState;

  if (callState === callStatus.CALL_IN_PROGRESS) {
    const screenSharingStream = store.getState().webrtc.screenSharingStrem;
    screenSharingStream?.getTracks().forEach((track) => track.stop);

    handleScreenSharing(true);
  }
};

export const changeInputDevice = async (
  deviceId: string,
  deviceType: "input" | "camera"
) => {
  const callState = store.getState().user.userCallState;
  if (callState === callStatus.CALL_IN_PROGRESS) {
    if (deviceType === "camera") {
      console.log("camera ghange");
      try {
        const selectedInputDeviceId =
          store.getState().webrtc.selectedInputDeviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: selectedInputDeviceId
            ? { deviceId: { exact: selectedInputDeviceId } }
            : true,
          video: { deviceId: { exact: deviceId } },
        });

        const videoTrack = stream.getVideoTracks()[0];

        const senders = await peerConnection?.getSenders();

        const sender = senders?.find(
          (sender) => sender.track?.kind === "video"
        );

        if (!sender) {
          toast("Failed to change camera");
          return;
        }

        await sender?.replaceTrack(videoTrack);

        store.dispatch(setLocalStream(stream));
      } catch {
        toast.error("Failed to change camera");
      }
    } else if (deviceType === "input") {
      try {
        const selectedCameraDeviceId =
          store.getState().webrtc.selectedCameraDeviceId;
        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedCameraDeviceId
            ? { deviceId: { exact: selectedCameraDeviceId } }
            : true,
          audio: { deviceId: { exact: deviceId } },
        });

        if (store.getState().user.isInGroupCall) {
          const groupUsers = store.getState().webrtc.groupCallUsers;

          const user = groupUsers.find((user) => user.peerId === myPeerId);
          if (!user) {
            throw new Error("Error failed to change input");
          }

          const newUser = {
            ...user,
            streamId: stream.id,
          };

          const newGroupUsers = [...groupUsers, newUser];

          store.dispatch(setNewGroupCallUsers(newGroupUsers));
        }

        store.dispatch(setLocalStream(stream));
      } catch (err) {
        toast.error("Failed to change input");
        console.error(err);
      }
    }
  }
};
