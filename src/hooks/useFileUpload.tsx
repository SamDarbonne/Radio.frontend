import { useRef, useState } from "react";
import api, { Song } from "../fetch";

const useFileUpload = (onSuccess: (uploadedIds: string[]) => void) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const triggerUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();

    // Array.from(selectedFiles).forEach((file) => {
    //   console.log(file);
    //   formData.append("files", file);
    // });
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("files", selectedFiles[i]);
    }
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await api.songs.upload(formData);
      const uploadedIds = response.map((media: Song) => media.id);
      onSuccess(uploadedIds);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadInputProps = {
    type: "file",
    ref: fileInputRef,
    onChange: handleFileChange,
    multiple: true,
  };

  return { uploadInputProps, triggerUpload };
};

export default useFileUpload;
