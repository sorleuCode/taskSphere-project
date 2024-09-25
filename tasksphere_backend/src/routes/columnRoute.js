
import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/columnController'
import {  verifyToken, isAdminOrBoardOwner} from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.post("/create", verifyToken, isAdminOrBoardOwner, columnValidation.createNew, columnController.createNew)

Router.put("/update/:id", verifyToken,  columnValidation.update, columnController.update)
Router.get("/:boardId", verifyToken, columnController.getColumns)
Router.delete("/delete/:id", verifyToken, isAdminOrBoardOwner, columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router;