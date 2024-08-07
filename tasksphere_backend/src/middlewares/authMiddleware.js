const jwt = require('jsonwebtoken');
require('dotenv')
const User = require("../models/userModel")

const verifyToken = async (req, res, next) => {



  const token = req.cookies.token;
  if (token) {

    try {

        console.log(token)
      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }

      const decoded =   jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

      req.user = await User.findById(decoded.id).select("-password");

      if (!req?.user?.role === "admin") {
        return res.status(401).json({ message: "Not authorized, only Admin can perform this function" });
      }
      next();


    }

    catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    } 
    
  }
    else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
}



module.exports = { verifyToken };