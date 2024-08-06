import React, { useState } from "react";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { toast } from "react-toastify";

const UploadProfilePic = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileUpload = async (event) => {
    try {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(selectedFile.name);

        const snapshot = await fileRef.put(selectedFile);
        const downloadedUrl = await snapshot.ref.getDownloadURL();

        setImageUrl(downloadedUrl);
        console.log("File uploaded successfully. Download URL:", downloadedUrl);
      } else {
        toast.error("No file selected");
      }
    } catch (error) {
      toast.error(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <form className="">
      <TextField
        type="file"
        onChange={handleFileUpload}
        name="imageUrl"
        id="imageUrl"
      />
    </form>
  );
};

export default UploadProfilePic;
