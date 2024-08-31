

import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const columnSchema = new Schema({
  boardId: {
    type: String,
    required: [true, 'Board ID is required'],
    match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [50, 'Title must be at most 50 characters'],
    trim: true
  },
  cardOrderIds: {
    type: [Schema.Types.ObjectId],
    default: [],
    validate: {
      validator: function(v) {
        return v.every(id => OBJECT_ID_RULE.test(id));
      },
      message: OBJECT_ID_RULE_MESSAGE
    }
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

const Column = mongoose.model('Column', columnSchema);


const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await Column.validate(data);
}

const createNew = async (data) => {
  try {
    await validateBeforeCreate(data);

    const newColumnToAdd = {
      ...data,
      boardId: new mongoose.Types.ObjectId(data.boardId)
    };

    const createdColumn = await Column.create(newColumnToAdd);
    return createdColumn;
  } catch (error) {
    throw new Error(error);
  }
};


const findOneById = async (columnId) => {
  try {
    const result = await Column.findById(columnId).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};


const pushCardOrderIds = async (card) => {
  try {
    const result = await Column.findByIdAndUpdate(
      card.columnId,
      { $push: { cardOrderIds: new mongoose.Types.ObjectId(card._id) } },
      { new: true }
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (columnId, updateData) => {
  try {
    // Filter out invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    // Convert cardOrderIds to ObjectId
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(_id => new mongoose.Types.ObjectId(_id));
    }

    const result = await Column.findByIdAndUpdate(
      columnId,
      { $set: updateData },
      { new: true }
    ).exec();

    
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};


const deleteOneById = async (columnId) => {
  try {
    const result = await Column.findByIdAndDelete(columnId).exec();
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const columnModel = { 
  Column,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  deleteOneById
}