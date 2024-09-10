const jwt = require("jsonwebtoken");


const generateJWT = (user) => {

  console.log("user", user)
    if(!user.googleId ){
      return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });
    }else if (user?.emailVerified === false) {
      return jwt.sign({email: user.email}, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

    }else {
      
      return jwt.sign({ id: user._id, email: user.email, googleId: user.googleId }, process.env.JWT_SECRET, {
          algorithm: "HS256",
          expiresIn: "1d",
        });
    }

  };

module.exports = generateJWT
  