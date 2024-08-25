const jwt = require('jsonwebtoken');
require('dotenv')
const User = require("../models/userModel")

const verifyToken = async (req, res, next) => {



  const token = req.cookies.token;
  if (token) {

    try {

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }

      const decoded =   jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      req.user = await User.findOne({email: decoded.email}).select("-password");

      next();


    }

    catch (error) {
      console.log(error);
      next(error)
    } 
    
  }
    else {
    next();
  }
}


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