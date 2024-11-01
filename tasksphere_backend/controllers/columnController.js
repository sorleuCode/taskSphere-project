
const { StatusCodes } = require('http-status-codes')
const columnModel  = require('../models/columnModel')
const columnService  = require('../services/columnService')

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

const getColumns = async (req, res) => {
  try {

      const columns = await columnModel.Column.find({boardId: req.params.boardId});

      if(columns) {
        res.status(StatusCodes.OK).json(columns)
      }else {

        res.status(500).json({message: "no columns found"})
      }

  } catch (error) {

      res.json(error.message)
  }
}



const update = async (req, res, next) => {
  try {
    const columnId = req.params.id

    const updatedColumn = await columnService.update(columnId, req.body)

    res.status(StatusCodes.OK).json(updatedColumn)
  } catch (error) { next(error) }
}

const deleteItem = async (req, res, next) => {
  try {
    const columnId = req.params.id
    const result = await columnService.deleteItem(columnId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({message: "Server error"})
  }
}

const columnController = {
  createNew,
  update,
  deleteItem,
  getColumns
}

module.exports = columnController