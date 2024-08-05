import React, { useState } from "react";
import { Button } from "@mui/material";
import {TextField} from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { toast } from "react-toastify";



const UploadProfilePic = () => {
    const [imageUrl, setImageUrl] = useState("")


    const handleFileUpload = async (event) => {
        try {
          const selectedFile = event.target.files[0];
      
          if (selectedFile) {
            const storageRef = firebase.storage().ref();
      
            const fileRef = storageRef.child(selectedFile.name);
      
            const response = await fileRef.put(selectedFile)
      
            if (response) {
              const downloadedUrl = response.ref.getDownloadURL();

              setImageUrl(downloadedUrl)
              
            }
      
      
          }else {
            toast.error("No file selected")
          }
      
      
        } catch (error) {
            toast.error(error)
        }
      };

  return (
    <form className="" onSubmit="">
      <TextField type="file" onChange={handleFileUpload} name="imageUrl" id="imageUrl"/>
      <Button variant="contained" color="primary" component="span">
        Upload
      </Button>
    </form>
  );
};

export default UploadProfilePic;
