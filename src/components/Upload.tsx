import { useFileUpload } from "../hooks";

const Upload = () => {
  const handleSuccessfulUpload = (uploadedIds: string[]) => {
    console.log(uploadedIds);
  };
  const { uploadInputProps, triggerUpload } = useFileUpload(
    handleSuccessfulUpload
  );
  return (
    <div className="upload">
      <button onClick={triggerUpload}>Upload</button>
      <input {...uploadInputProps}></input>
    </div>
  );
};

export default Upload;
