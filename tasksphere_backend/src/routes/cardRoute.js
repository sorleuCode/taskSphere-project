import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import {  verifyToken, isAdminOrBoardOwner} from '~/middlewares/authMiddleware'


const Router = express.Router()

Router.post("/create", isAdminOrBoardOwner, cardValidation.createNew, cardController.createNew)
Router.put("/update/:id", isAdminOrBoardOwner, cardController.updateCard)
Router.get("/:boardId", verifyToken, cardController.getAllcardsDetails)
Router.get("/:id",verifyToken, cardController.findOneById)

module.exports = Router
