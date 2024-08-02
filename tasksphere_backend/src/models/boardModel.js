
import { BOARD_TYPES } from '~/utils/constants'
// Define Collection (Name & Schema)
import mongoose from 'mongoose'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


const { Schema } = mongoose

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(BOARD_TYPES)
  },
  columnOrderIds: {
    type: [String],
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
})

const Board = mongoose.model('Board', boardSchema)




const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']



const validateBeforeCreate = async (data) => {
  return await Board.validate(data);
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    
    const createdBoard = await Board.create(validData);
    console.log(createdBoard)
    return createdBoard;

  } catch (error) {
    throw new Error(error);
  }
};
const findOneById = async (boardId) => {
  try {
    const result = await Board.findById(boardId).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


//Aggregate query to get all Columns and Cards belonging to the Board

const getDetails = async (id) => {
  try {
    const result = await Board.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), _destroy: false } },
      { $lookup: {
        from: 'columns',
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      }},
      { $lookup: {
        from: 'cards',
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      }}
    ]).exec();

    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

// Push a columnId element to the end of the columnOrderIds array
// Use $push in mongodb in this case to push an element to the end of the array
const pushColumnOrderIds = async (column) => {
  try {
    const result = await Board.findByIdAndUpdate(
      column.boardId,
      { $push: { columnOrderIds: column._id } },
      { new: true }
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


// Get a columnId element out of the columnOrderIds array
// Use $pull in mongodb in this case to remove an element from the array and then delete it
const pullColumnOrderIds = async (column) => {
  try {
    const result = await Board.findByIdAndUpdate(
      column.boardId,
      { $pull: { columnOrderIds: column._id } },
      { new: true }
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


const update = async (boardId, updateData) => {
  try {
    // Filter fields that we do not allow random updates
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new mongoose.Types.ObjectId(_id));
    }

    const result = await Board.findByIdAndUpdate(
      boardId,
      { $set: updateData },
      { new: true } // will return new results after updating
    ).exec();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


export const boardModel = {
  Board,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds
}
