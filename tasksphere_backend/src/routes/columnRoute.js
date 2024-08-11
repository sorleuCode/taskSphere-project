
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { isAdmin } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post("/create", columnValidation.createNew, columnController.createNew)

Router.put("/update-column/:id", columnValidation.update, columnController.update)
Router.delete("/delete-column/:id",isAdmin, columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router
