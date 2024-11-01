const express = require("express");
const Router = express.Router();
const {verifyToken} = require("../middlewares/authMiddleware")
const { userRegister,loginWithEmail, registerWithEmail,  verifyEmail, authCallback, googleAuth, userLogin, uploadProfilePic, getAllUsers, updateUser,logoutUser, getUser } = require("../controllers/userController");

Router.post("/register", userRegister);
Router.post("/registerWithEmail", verifyToken, registerWithEmail);
Router.post("/login", userLogin);
Router.post("/loginWithEmail", verifyToken, loginWithEmail);
Router.get("/", getAllUsers);
Router.get("/auth/google/callback", authCallback);

Router.get("/auth/google", googleAuth);
Router.get("/verifyEmail/:token", verifyEmail)

Router.get("/user", verifyToken, getUser)
Router.put("/update", verifyToken, updateUser)
Router.put("/uploadProfile", verifyToken, uploadProfilePic)
Router.post("/logout", logoutUser)
module.exports = Router;
