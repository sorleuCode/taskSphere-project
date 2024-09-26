

const cardModel  = require('../models/cardModel')
const columnModel = require('../models/columnModel')

const createNew = async (reqBody) => {
  try {
    const newCard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newCard)

    if (createdCard) {

      await columnModel.pushCardOrderIds(createdCard)
    }

    return createdCard
  } catch (error) { throw error }
}

const updateCard = async(cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedCard = await cardModel.update(cardId, updateData)
    return updatedCard

  } catch (error) {
    throw error 
  }
}

const findOneById = async (cardId) => {
  try {
    const card = await cardModel.findOneById(cardId)
    if (!card) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'card not found!')
    }
  } catch (error) {
    throw error
  }
}

const cardService = {
  createNew,
  updateCard,
  findOneById
}

module.exports = cardService
