const express = require('express')
const cardValidation  = require('../validations/cardValidation')
const cardController = require('../controllers/cardController')
const {  verifyToken, isAdminOrBoardOwner} = require('../middlewares/authMiddleware')


const Router = express.Router()

Router.post("/create", verifyToken, isAdminOrBoardOwner, cardValidation.createNew, cardController.createNew)
Router.put("/update/:cardId", verifyToken, isAdminOrBoardOwner, cardController.updateCard)
Router.get("/:boardId", verifyToken, cardController.getAllcardsDetails)
Router.get("/:cardId",verifyToken, cardController.findOneById)
Router.post("/meeting-notif",verifyToken, cardController.sendMeetingInvite)
Router.get("/members/:cardId",verifyToken, cardController.getCardMembers)

module.exports = Router
