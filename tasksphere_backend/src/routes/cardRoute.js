import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.post("/create", cardValidation.createNew, cardController.createNew)
Router.put("/update/:id", cardController.updateCard)
Router.get("/", cardController.getAllcardsDetails)
Router.get("/:id", cardController.findOneById)

module.exports = Router
