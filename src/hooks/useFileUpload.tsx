import { useRef, useState } from "react";
import api, { SongData } from "../fetch";

const useFileUpload = (onSuccess: (uploadedIds: string[]) => void) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const triggerUpload = async () => {
    if (!selectedFiles) return;
    const formData = new FormData();

    Array.from(selectedFiles).forEach((file) => {
      console.log(file);
      formData.append("files", file);
    });
    try {
      const response = await api.songs.upload(formData);
      const uploadedIds = response.map((media: SongData) => media.id);
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
