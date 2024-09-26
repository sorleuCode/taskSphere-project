
const  columnModel = require('../models/columnModel')
const  boardModel  = require('../models/boardModel')
const  cardModel   = require('../models/cardModel')
const  { StatusCodes } = require('http-status-codes')
const  ApiError = require('../utils/ApiError')

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)

    if (createdColumn) {

      await boardModel.pushColumnOrderIds(createdColumn)
    }

    return createdColumn
  } catch (error) { throw error }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) { throw error }
}

const deleteItem = async (columnId) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)

    if (!targetColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found!')
    }
    
    await columnModel.deleteOneById(columnId)

    await cardModel.deleteManyByColumnId(columnId)

    await boardModel.pullColumnOrderIds(targetColumn)

    return { deleteResult: 'Column and its Cards deleted successfully!' }
  } catch (error) { throw error }
}

const columnService = {
  createNew,
  update,
  deleteItem
}
module.exports = columnService