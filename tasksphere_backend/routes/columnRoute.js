
const express = require('express')
const columnValidation  = require('../validations/columnValidation')
const  columnController  = require('../controllers/columnController')
const  {  verifyToken, isAdminOrBoardOwner} =  require('../middlewares/authMiddleware')

const Router = express.Router()

Router.post("/create", verifyToken, isAdminOrBoardOwner, columnValidation.createNew, columnController.createNew)

Router.put("/update/:id", verifyToken,  columnValidation.update, columnController.update)
Router.get("/:boardId", verifyToken, columnController.getColumns)
Router.delete("/delete/:id", verifyToken, isAdminOrBoardOwner, columnValidation.deleteItem, columnController.deleteItem)

module.exports = Router;