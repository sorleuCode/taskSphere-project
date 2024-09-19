
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import {  verifyToken, isAdminOrBoardOwner} from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post("/create", isAdminOrBoardOwner, columnValidation.createNew, columnController.createNew)

Router.put("/update/:id",isAdminOrBoardOwner,  columnValidation.update, columnController.update)
Router.get("/:boardId", verifyToken, columnController.getColumns)
Router.delete("/delete/:id", isAdminOrBoardOwner, columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router;