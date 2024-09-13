
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
import { isAdmin, verifyToken } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })

Router.get("/myboards", isAdmin, boardController.getAllboardsDetails)

Router.post("/create", isAdmin, boardValidation.createNew, boardController.createNew)
Router.get("/members", verifyToken, isAdmin,  boardController.getAllMembersAndOwnersByUser, boardController.createNew)


Router.get("/:id", isAdmin, boardController.getDetails)
Router.put("/update/:id", isAdmin, boardValidation.update, boardController.update)
Router.put("/update/role/:id", isAdmin, boardController.updateMemberRole)


Router.put('/moving-card', isAdmin, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

module.exports = Router;
