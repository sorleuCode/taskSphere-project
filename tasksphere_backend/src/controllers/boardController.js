/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
import { boardModel } from '~/models/boardModel'


const createNew = async (req, res, next) => {
  try {
   
    const allData = {...req.body, creatorId: req.user._id}
    const createdBoard = await boardService.createNew(allData)

    console.log("controller", createdBoard)

    // Có kết quả thì trả về phía Client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    // Sau này ở khóa MERN Stack Advance nâng cao học trực tiếp sẽ có thêm userId nữa để chỉ lấy board thuộc về user đó thôi chẳng hạn...vv
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}



const getAllboardsDetails = async (req, res) => {
  try {

      const boards = await boardModel.Board.find({creatorId: req.user._id});

      if(boards) {
        res.status(StatusCodes.OK).json(boards)
      }
      res.status(500).json({message: "no boards found"})
  } catch (error) {

      res.json(error.message)
  }
}




const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const updatedBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updatedBoard)
  } catch (error) { next(error) }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  getAllboardsDetails,
  update,
  moveCardToDifferentColumn
}