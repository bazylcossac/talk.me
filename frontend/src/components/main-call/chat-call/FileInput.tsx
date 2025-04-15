import { MAX_FILE_SIZE } from "@/lib/constants";
import { Ref, useState } from "react";
import { IoMdSend } from "react-icons/io";

function FileInput({ fileRef }: { fileRef: Ref<HTMLInputElement> }) {
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0]);
    const selectedFile = e.target.files![0];
    if (selectedFile.size > MAX_FILE_SIZE) {
      //
    }
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
          <p className="text-xs mb-1 ">Selected:</p>
          <p className="text-xs mb-1 px-1 truncate text-white/50">
            {file?.name}
          </p>
        </div>
      </div>
    </>
  );
}

export default FileInput;
