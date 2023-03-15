import React from "react";

function FileUploader({handleResult}) {

  function handleUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      handleResult(reader.result)
    };
  }

  return (
    <div className="container-file-uploader">
      <input type="file" onChange={handleUpload} />
    </div>
  );
}

export default FileUploader;