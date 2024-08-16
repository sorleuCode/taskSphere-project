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
  const token = req.cookies.token;
  if (token) {

      const decoded =   jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      req.user = await User.findOne({email: decoded.email}).select("-password");

      if(!req.user) {
        res.status(401);
        throw new Error("You are not authorised");

      }

    if (!req?.user?.role === "admin") {
      return res.status(401).json({ message: "Not authorized, only Admin can perform this function" });
    }
    next();
  }else {
    res.status(401);
        throw new Error("Not authorized, no token");
  }

}



module.exports = { verifyToken, isAdmin };