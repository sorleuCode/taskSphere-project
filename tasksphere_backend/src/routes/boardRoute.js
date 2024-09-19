
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import {  verifyToken, isAdminOrBoardOwner, isBoardCreator } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })

Router.get("/myboards", verifyToken, boardController.getAllboardsDetails)

Router.post("/create", verifyToken, boardValidation.createNew, boardController.createNew)
Router.get("/members", verifyToken,  boardController.getAllMembersAndOwnersByUser, boardController.createNew)


Router.get("/:id", verifyToken, boardController.getDetails)
Router.put("/update/:id", isAdminOrBoardOwner, boardValidation.update, boardController.update)
Router.put("/update/role/:id",  isBoardCreator, boardController.updateMemberRole)


Router.put('/moving-card', verifyToken, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

module.exports = Router;
