import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import {  verifyToken, isAdminOrBoardOwner} from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.post("/create", verifyToken, isAdminOrBoardOwner, cardValidation.createNew, cardController.createNew)
Router.put("/update/:id", verifyToken, isAdminOrBoardOwner, cardController.updateCard)
Router.get("/:boardId", verifyToken, cardController.getAllcardsDetails)
Router.get("/:cardId",verifyToken, cardController.findOneById)
Router.get("/members/:cardId",verifyToken, cardController.getCardMembers)

module.exports = Router
