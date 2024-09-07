const express = require("express");
const Router = express.Router();

const {boardInvitation, invitationAcceptance} = require("../controllers/invitationController")


Router.post("/board/:boardId", boardInvitation)
Router.post("/respond/:invitationId", invitationAcceptance)


module.exports = Router;
