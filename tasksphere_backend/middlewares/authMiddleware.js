const jwt = require('jsonwebtoken');
require('dotenv')
const User = require("../models/userModel")
const { boardModel } = require("../models/boardModel")
const {cardModel} = require("../models/cardModel")

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    // If decoded is successful, find the user in the database
    req.user = await User.findOne({ email: decoded.email }).select("-password");

    // If no user is found, return an error
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    // Handle token expiry
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please log in again." });
    }

    // Handle other errors
    return res.status(403).json({ message: "Invalid token" });
  }
};



const isBoardCreator = async (req, res, next) => {
  try {
    
    // Extract board ID from request params or body (adjust based on your use case)
    const boardId = req.params.boardId;
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    // Fetch the board details
    const board = await boardModel.Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if the user is the board creator
    if (board.creatorId === req.user._id.toString()) {
      // Proceed to next middleware or route handler
      return next();
    } else {
      // Return here to prevent further execution
      return res.status(401).json({ message: "Not authorized, only the board creator can perform this function" });
    }
  } catch (error) {
    // Return here to prevent further execution
    return res.status(400).json({ message: "Authorization error: " + error.message });
  }
};





const isAdminOrBoardOwner = async (req, res, next) => {
  try {
    
    // Extract board ID from request params or body (adjust based on your use case)
    let boardId
    let board;
    
    const creator = req.user._id.toString()
    board = await boardModel.Board.findOne({creatorId: creator});
    console.log("board", board)

    boardId = board?._id
    if (!board) {
      boardId =  req.params.boardId || req.body.boardId
      board = await boardModel.Board.findById(boardId)
    }

    if (!boardId) {
      return res.status(400).json({ message: "Not authorized to do this" });
    }

    // Fetch the board details
    if (!board) {
      return res.status(404).json({ message: "Not authorized" });
    }

    // Check if the user is the board creator or included in the ownerIds
    if (board.creatorId === req.user._id.toString() || board.ownerIds.includes(req.user._id)) {
      return next();
    } else {
      return res.status(403).json({ message: "Not authorized to access this board" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Authorization error: " + error.message });
  }
};


/**
 * Middleware to check if the user is a member of the card
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const checkCardMember = async (req, res, next) => {
  const { cardId } = req.params;
 const userId = req.user._id.toString()

  try {
    if (!cardId) {
      return res.status(400).json({ message: 'Not authorized' });
    }

    // Check if the user is a member of the card
    const card = await cardModel.Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    const board = await boardModel.findOneById(card.boardId)
    console.log("board", board)


    const isBoardCreator = board ? board.creatorId.toString() === userId : undefined
    if (card.memberIds.includes(userId) || isBoardCreator) {
      next();
    }else {
      
      return res.status(401).json({ message: 'Unauthorized: You are not a member or creator of the card.' });

    }

    // Proceed to the next middleware/route if the user is a member
    
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};







module.exports = { verifyToken, checkCardMember, isAdminOrBoardOwner, isBoardCreator };