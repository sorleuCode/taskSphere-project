import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'

const Router = express.Router()

Router.post("/create", cardValidation.createNew, cardController.createNew)

module.exports = Router
