const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");
const passport = require("passport");
const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken');




// User registration
const userRegister = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Generate JWT token
      const token = generateJWT({ email: email });

      // Set cookie with the token
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "strict",
        secure: false // secure in production
      });



      // Nodemailer configuration
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "sorleu3@gmail.com",
          pass: "iwfi ozbb cucb mlfr"
        },
      });

      const mailConfigurations = {
        from: 'sorleu3@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Hi! ${fullname}, You have recently visited 
             our website and entered your email.
             Please follow the given link to verify your email
             http://localhost:5173/user/verify/${token}  
             Thanks`
      };

      transporter.sendMail(mailConfigurations, async function (error, info) {
        if (error) {
          return res.status(400).json({ message: `$Error Sending verification mail: ${error.message}` });
        }
       const  newUser = new User({
          fullname,
          email,
          password,
        });

        await newUser.save();

        const user = await User.findById(newUser._id).select("-password")

        
        return res.status(200).json(user);
      })

    

   

  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};


const registerWithEmail = async(req, res) => {

  const user = await User.findOne({googleId: req?.user?.googleId }).select("-password");
      user ? res.status(200).json(user) : res.status(400).json({ message: "Registering with email failed" });
      

}



// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
  
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = generateJWT(user);

        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: "strict",
          secure: false,
        });
        const userWithoutPassword = await User.findById(user._id).select("-password")
        res.status(200).json(userWithoutPassword );
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const loginWithEmail = async(req, res) => {
  const user = await User.findOne({googleId: req?.user?.googleId }).select("-password");
      user ? res.status(200).json(user) : res.status(400).json({ message: "Error Occured" });
}

// get all users

const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (user) {
    const { _id, fullname, email, role } = admin;

    res.status(200).json({ _id, fullname, email, role });
  } else {
    res.status(404).json({ message: "user not found" });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    if (imageUrl) {
      user.profileImage = imageUrl;
      user.fullname = user.fullname;
      user.email = user.email;
      user.password = user.password;
      user.createdAt = Date.now();
    }

    const updatedUser = await user.save();

    res.status(200).json({userProfile: updatedUser.profileImage});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find().sort("-createdAt");

  if (!users) {
    res.status(500);
    throw new Error("Something went wrong!");
  }
  res.status(200).json(users);
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const { email, fullname, password } = req.body;

    if (email) user.email = email;
    if (fullname) user.fullname = fullname;
    if (password) user.password = password;
    user.createdAt = Date.now();

    const updatedUserDetails = await user.save();
    res.status(200).json(updatedUserDetails);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Error updating user" });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the "token" cookie by setting it to an empty string and an expiration date in the past
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "strict",
      secure: false,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during logout",
      error: error.message,
    });
  }
};

const googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});


const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })

    if (!decoded) {
      res.status(400).json({ message: 'Email verification failed, possibly the link is invalid or expired' });
    }


    // Find the user by the email stored in the JWT payload
    const user = await User.findOne({ email: decoded.email }).select("-password");

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    user.emailVerified = true;
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "strict", //set to none for production
      secure: false,  //set to true for production
    });

    res.status(200).json(user);

    // Update the user's email verification status
  } catch (dbError) {
    // In case of an error while updating the user, delete the user
    await User.deleteOne({ email: decoded.email });
    res.status(500).json({ message: 'Error updating user and user has been deleted' });
  }

};


const authCallback = async (req, res) => {
  await passport.authenticate(
    "google",
    {
      session: false,
      // access_type: "offline",
      // scope: ["email", "profile"],
    },
    (err, user) => {
      // This function is called after authentication
      if (err || !user) {
        // Redirect to frontend login page with an error query
        res.status;
        return res.redirect("http://localhost:5173/login");
      }

      // Generate a JWT and set it as a cookie
      const token = generateJWT(user);

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "strict", //set to none for production
        secure: false,  //set to true for production
      });

      // Redirect to the frontend profile page or another route
      res.redirect("http://localhost:5173/user/googlecbk");
    }
  )(req, res);
};

module.exports = {
  userRegister,
  verifyEmail,
  userLogin,
  getAllUsers,
  updateUser,
  uploadProfilePic,
  logoutUser,
  getUser,
  authCallback,
  registerWithEmail,
  loginWithEmail,
  googleAuth,
};
