
const express =  require('express')
const { StatusCodes } = require('http-status-codes')
const boardValidation  = require('../validations/boardValidation')
const boardController  = require('../controllers/boardController')
const {  verifyToken, isAdminOrBoardOwner, isBoardCreator } = require( '../middlewares/authMiddleware')

const Router = express.Router()

Router.get("/", (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'GET: API get list boards' })
  })

Router.get("/myboards", verifyToken, boardController.getAllboardsDetails)

Router.post("/create", verifyToken, boardValidation.createNew, boardController.createNew)
Router.get("/members", verifyToken,  boardController.getAllMembersAndOwnersByUser, boardController.createNew)


Router.get("/:boardId", verifyToken, boardController.getDetails)
Router.put("/update/:boardId", verifyToken, isAdminOrBoardOwner, boardValidation.update, boardController.update)
Router.put("/update/role/:boardId", verifyToken,  isBoardCreator, boardController.updateMemberRole)


Router.put('/moving-card', verifyToken, boardValidation.moveCardToDifferentColumn, boardController.moveCardToDifferentColumn)

module.exports = Router;
