
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'

const Router = express.Router()

Router.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })

Router.get("/", boardController.getAllboardsDetails)

Router.post("/create", boardValidation.createNew, boardController.createNew)


Router.get("/:id", boardController.getDetails)
Router.put("/update/:id", boardValidation.update, boardController.update)


Router.put('/moving_card', boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

module.exports = Router;
