/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
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

export const cardService = {
  createNew
}
