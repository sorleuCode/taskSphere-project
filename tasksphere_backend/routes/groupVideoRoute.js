const express = require("express");
const Router = express.Router();
const {getStreamToken} = require("../controllers/groupVideoController")
const {checkCardMember, verifyToken} = require("../middlewares/authMiddleware")


Router.get("/getToken/:cardId", verifyToken, checkCardMember, getStreamToken)


module.exports = Router;