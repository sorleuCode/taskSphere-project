const jwt = require('jsonwebtoken');
require('dotenv')
const User = require("../models/userModel")
const { boardModel } = require("../models/boardModel")

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
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      req.user = await User.findOne({ email: decoded.email }).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    // Extract board ID from request params or body (adjust based on your use case)
    const boardId = req.params.id;
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
      return res.status(403).json({ message: "Not authorized, only the board creator can perform this function" });
    }
  } catch (error) {
    // Return here to prevent further execution
    return res.status(403).json({ message: "Authorization error: " + error.message });
  }
};





const isAdminOrBoardOwner = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    // Verify the token and extract user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = await User.findOne({ email: decoded.email }).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

  

    // Extract board ID from request params or body (adjust based on your use case)
    const boardId = req.params.boardId
    if (!boardId) {
      return res.status(400).json({ message: "Board ID is required" });
    }

    // Fetch the board details
    const board = await boardModel.Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
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




module.exports = { verifyToken, isAdminOrBoardOwner, isBoardCreator };