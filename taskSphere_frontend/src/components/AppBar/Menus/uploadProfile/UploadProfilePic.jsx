import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePicture } from "../../../../redux/reducers/userSlice";

const UploadProfilePic = ({handleClose}) => {
  const dispatch = useDispatch()
  const {loading, error, userProfilePic} = useSelector((state) => state.user)

  
  useEffect(() => {
    if(error && !loading) {
      toast.error(`${error}`, {position: "top-right"})
    }
    if(userProfilePic && !loading) {
      toast.success("profile image uploaded successfully!", {position: "top-right"});
      handleClose()
    }
  }, [loading, userProfilePic, error])
  const handleImageUrlUpload = (downloadedUrl) => {
    if(downloadedUrl) {

      const imageLink = {imageUrl: downloadedUrl}
      console.log("imageUrl", downloadedUrl)
          dispatch(uploadProfilePicture({imageLink}))

    }
  }

  const handleFileUpload = async (event) => {
    try {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(selectedFile.name);

        const snapshot = await fileRef.put(selectedFile);
        const downloadedUrl = await snapshot.ref.getDownloadURL();

        if(downloadedUrl) {
          handleImageUrlUpload(downloadedUrl)
        }else{
          toast.error("Error uploading file", {position: "top-right"})
        }

        
        
      } else {
        toast.error("No file selected", {position: "top-right"});
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
