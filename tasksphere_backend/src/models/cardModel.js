
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  boardId: {
    type: String,
    required: [true, 'Board ID is required'],
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
  },
  columnId: {
    type: String,
    required: [true, 'Column ID is required'],
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [50, 'Title must be at most 50 characters'],
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  _destroy: {
    type: Boolean,
    default: false
  }
});

const Card = mongoose.model('Card', cardSchema);






const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await Card.validate(data);
}

const createNew = async (data) => {
  try {
    await validateBeforeCreate(data);

    data.boardId = new mongoose.Types.ObjectId(data.boardId);
    data.columnId = new mongoose.Types.ObjectId(data.columnId);

    const createdCard = await Card.create(data);
    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
}

const findOneById = async (cardId) => {
  try {
    const result = await Card.findById(cardId).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

const update = async (cardId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.columnId) updateData.columnId = new mongoose.Types.ObjectId(updateData.columnId);

    const result = await Card.findByIdAndUpdate(
      cardId,
      { $set: updateData },
      { new: true } 
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await Card.deleteMany({ columnId: new mongoose.Types.ObjectId(columnId) }).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
}


export const cardModel = {
  Card,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}