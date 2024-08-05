/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { cardService } from '~/services/cardService'

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}

const updateCard = async (req , res, next) => {

  try {
    
    const updatedCard = await cardService.updateCard(req.params.id, req.body)

    res.status(StatusCodes.CREATED).json(updatedCard)


  } catch (error) {
    next(error)
  }
}

const findOneById = async (req, res, next) => {
  try {
    const card = await cardModel.findOneById(req.params.id);

      if(card) {
        res.status(StatusCodes.OK).json(card)
      }
      res.status(500).json({message: "no card found"})
  } catch (error) {
    throw(error)
  }
}

const getAllcardsDetails = async (req, res) => {
  try {
      const cards = await columnModel.Card.find();
      if(cards) {
        res.status(StatusCodes.OK).json(cards)
      }
      res.status(500).json({message: "no cards found"})
  } catch (error) {
      res.json(error.message)
  }
}

export const cardController = {
  createNew, getAllcardsDetails, updateCard, findOneById
}
