
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import { isAdmin } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post("/create", columnValidation.createNew, columnController.createNew)

Router.put("/update/:id", columnValidation.update, columnController.update)
Router.delete("/delete/:id", isAdmin, columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router;
