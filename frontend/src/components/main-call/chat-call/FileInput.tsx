import { ACCEPTED_FILES, MAX_FILE_SIZE } from "@/lib/constants";
import { useUser } from "@clerk/clerk-react";
import { Ref } from "react";
import { toast } from "sonner";
import { sendMessageDataChannels } from "@/functions/sendMessageDataChannels";

function FileInput({ fileRef }: { fileRef: Ref<HTMLInputElement> }) {
  const { user } = useUser();

  if (!user) return;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file.size > MAX_FILE_SIZE) {
      toast("Ops! File is to heavy! Try something to 100mb");
      return;
    }
    if (!ACCEPTED_FILES.includes(file.type)) {
      toast("Weird file type! Sorry!");
      return;
    }
    sendMessageDataChannels(file, user);
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
      </div>
    </>
  );
}

export default FileInput;
