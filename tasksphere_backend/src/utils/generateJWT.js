const jwt = require("jsonwebtoken");


const generateJWT = (user) => {
    if(!user?.googleId ){
      return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
    }

    if (user.emailVerified === false) {
      return jwt.sign({email: user.email}, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "5m",
      });

    }

    return jwt.sign({ id: user._id, email: user.email, googleId: user.googleId }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
  };

module.exports = generateJWT
  