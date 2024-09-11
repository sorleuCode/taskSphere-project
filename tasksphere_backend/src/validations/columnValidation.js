import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const createNew = async (req, res, next) => {
  const correctCondition = new mongoose.Schema({
    boardId: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      trim: true
    }
  });

  try {
    const CoValidation = mongoose.models.ColValidation || mongoose.model('ColValidation', correctCondition);
    await CoValidation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const update = async (req, res, next) => {
  const correctCondition = new mongoose.Schema({
    // boardId: {
    //   type: String,
    //   match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
    // },
    title: {
      type: String,
      minlength: 3,
      maxlength: 50,
      trim: true,
      require: false
    },
    cardOrderIds: [{
      type: String,
      match: [OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE]
    }]
  }, { strict: false }); // Allow unknown fields

  try {
    const validation = mongoose.models.Validation || mongoose.model('Validation', correctCondition);
    await validation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const deleteItem = async (req, res, next) => {
  const correctCondition = new mongoose.Schema({
    id: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    }
  });

  try {
    const validation = mongoose.models.Validation || mongoose.model('Validation', correctCondition);
    await validation.validate(req.params);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

export const columnValidation = {
  createNew,
  update,
  deleteItem
};
