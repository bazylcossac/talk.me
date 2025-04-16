import { sendFile } from "@/connection/webrtcConnection";
import { ACCEPTED_FILES, MAX_FILE_SIZE } from "@/lib/constants";
import { setCurrentCallMessages } from "@/store/slices/webrtc";
import { useUser } from "@clerk/clerk-react";
import { Ref, useState } from "react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";

function FileInput({ fileRef }: { fileRef: Ref<HTMLInputElement> }) {
  const user = useUser();
  const dispatch = useDispatch();
  const [file, setFile] = useState<File | null>(null);
  if (!user.user) return; ///

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0]);
    const selectedFile = e.target.files![0];
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast("Ops! File is to heavy! Try something to 100mb");
      return;
    }
    if (!ACCEPTED_FILES.includes(selectedFile.type)) {
      toast("Weird file type! Sorry!");
      return;
    }
    const messageId = crypto.randomUUID();
    sendFile({
      selectedFile,
      username:
        (user.user.username as string) || (user.user.fullName as string),
      type: "file",
      messageId,
    });
    const url = URL.createObjectURL(selectedFile);
    dispatch(
      setCurrentCallMessages({
        type: "file",
        your: true,
        username: user.user?.username || user.user?.fullName,
        url: url,
        messageId,
        fileType: selectedFile.type,
      })
    );

    setFile(null);
  };

  return (
    <>
      <div className="flex flex-col">
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex items-center">
          {file && <p className="text-xs mb-1 ">Selected:</p>}
          <p className="text-xs mb-1 px-1 truncate text-white/50">
            {file?.name}
          </p>
        </div>
      </div>
    </>
  );
}

export default FileInput;
