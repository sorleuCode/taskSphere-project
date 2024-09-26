
const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');
const ApiError = require('../utils/ApiError');
const { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } = require('../utils/validators');

const createNew = async (req, res, next) => {
  const correctCondition = new mongoose.Schema({
    boardId: {
      type: String,
      required: [true, OBJECT_ID_RULE_MESSAGE],
      match: OBJECT_ID_RULE
    },
    columnId: {
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
    const CardValidation =   mongoose.models.CardValidation || new mongoose.model('CardValidation', correctCondition);
    await CardValidation.validate(req.body);
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
}

const cardValidation = {
  createNew
}

module.exports = cardValidation