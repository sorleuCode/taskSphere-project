const express = require("express");
const Router = express.Router();
const {verifyToken} = require("../middlewares/authMiddleware")
const { userRegister, verifyEmail, authCallback, googleAuth, userLogin, uploadProfilePic, getAllUsers, updateUser,logoutUser, getUser } = require("../controllers/userController");

Router.post("/register", userRegister);
Router.post("/login", verifyToken, userLogin);
Router.get("/", getAllUsers);
Router.get("/auth/google/callback", authCallback);

Router.get("/auth/google", googleAuth);
Router.get("/verifyEmail/:token", verifyEmail)

Router.get("/:userId", getUser)
Router.put("/update/:id", updateUser)
Router.put("/uploadProfile/:id", uploadProfilePic)
Router.post("/logout", logoutUser)

module.exports = Router;
