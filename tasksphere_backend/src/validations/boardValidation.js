import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { BOARD_TYPES } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
 
  const correctCondition = new mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required (trungquandev)'],
      minlength: [3, 'Title length must be at least 3 characters long (trungquandev)'],
      maxlength: [50, 'Title length must be less than or equal to 50 characters long (trungquandev)'],
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      trim: true
    },
    /**
     * Tips: Instead of calling all types of the board one by one to put into the valid() function, you can use Object.values() combined with the Spread Operator of JS.
     * Specifically: .valid(...Object.values(BOARD_TYPES))
     * By doing so, later on, if you add or modify anything in the BOARD_TYPES in the constants file, you won't need to modify these places using Joi in the Model or Validation.
     * This optimizes and simplifies the code.
    */
    type: {
      type: String,
      required: true,
      enum: Object.values(BOARD_TYPES)
    }
  });

  try {
    const validation = mongoose.models.Validation || mongoose.model('Validation', correctCondition);
    await validation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

const update = async (req, res, next) => {
  // Note: Do not use the required() method in the Update case
  const correctCondition = new mongoose.Schema({
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true
    },
    description: {
      type: String,
      minlength: 3,
      maxlength: 255,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(BOARD_TYPES)
    },
    columnOrderIds: [{
      type: String,
      match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
    }]
  }, { strict: false }); // Allow unknown fields

  try {
    const validation =  mongoose.models.Validation || new mongoose.model('Validation', correctCondition);
    await validation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const correctCondition = new mongoose.Schema({
    currentCardId: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    },
    prevColumnId: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    },
    prevCardOrderIds: [{
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    }],
    nextColumnId: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    },
    nextCardOrderIds: [{
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    }]
  });

  try {
    const validation = mongoose.models.Validation || new mongoose.model('Validation', correctCondition);
    await validation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}
