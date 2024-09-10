const jwt = require('jsonwebtoken');
require('dotenv')
const User = require("../models/userModel")

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



const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      req.user = await User.findOne({ email: decoded.email }).select("-password");

      if (req?.user?.role !== "admin") {
        // Return here to prevent further execution
        return res.status(401).json({ message: "Not authorized, only Admin can perform this function" });
      }

      // Proceed to next middleware or route handler
      return next();
    } else {
      // Return here to prevent further execution
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
  } catch (error) {
    // Return here to prevent further execution
    return res.status(403).json({ message: error});
  }
};

module.exports = isAdmin;


module.exports = { verifyToken, isAdmin };