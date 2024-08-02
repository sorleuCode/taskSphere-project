
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'

const Router = express.Router()

Router.post("/create", columnValidation.createNew, columnController.createNew)

Router.put("/update-column/:id", columnValidation.update, columnController.update)
Router.delete("/delete-card/:id", columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router
