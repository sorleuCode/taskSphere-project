const express = require("express");
const Router = express.Router();

const {createInvitation} = require("../controllers/invitationController")


Router.post("/board/:boardId", createInvitation)


module.exports = Router;
