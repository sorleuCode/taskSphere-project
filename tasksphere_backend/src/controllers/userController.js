const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT")
const passport = require("passport")

// User registration
const userRegister = async (req, res) => {
  const {
    fullname,
    email,
    password,
  } = req.body;

  try {

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res
      .status(400)
      .json({ message: "User with this email already exists" });
  }

  
    const user = new User({
      fullname,
      email,
      password
      
    });

    const token = generateJWT(user);

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateJWT(user)

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });
      res.json({ user });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all users

const getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (user) {
    const { _id, fullname, email, role } = admin;

    res.status(200).json({ _id, fullname, email, role })
  } else {
    res.status(404).json({ "message": "user not found" })
  }
}

const uploadProfilePic = async (req, res) => {
  try {
    const {imageUrl} = req.body
    const  user = await User.findById(req.params.id)
    if (!user) {
      console.error(`User with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "User not found" });
    }

   
    if (imageUrl) {

        user.profileImage = imageUrl;
        user.fullname = user.fullname;
        user.email = user.email;
        user.password = user.password;
        user.createdAt = Date.now()
      } 
        

    const updatedUser = await user.save();

    res.status(200).json(updatedUser)
    

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


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
    console.log(`Updating user with ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found`);
      return res.status(404).json({ error: "User not found" });
    }

    const { email, fullname, password } = req.body;

    

    if (email) user.email = email;
    if (fullname) user.fullname = fullname;
    if (password) user.password = password;
      user.createdAt = Date.now()
   


    const updatedUserDetails = await user.save();
    res.status(200).json(updatedUserDetails);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the "token" cookie by setting it to an empty string and an expiration date in the past
    res.cookie("token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during logout",
      error: error.message,
    });
  }
};


const googleAuth = passport.authenticate("google", {
    scope: ["email", "profile"],
  })

const authCallback = async(req, res) => {

     await passport.authenticate("google", { session: false}, (err, user) => {

      // This function is called after authentication
    if (err || !user) {
      // Redirect to frontend login page with an error query
      return res.redirect('http://localhost:5173/login');
    }

    // Generate a JWT and set it as a cookie
    const token = generateJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
    });

    // Redirect to the frontend profile page or another route
    res.redirect('http://localhost:5173/dashboard');
  })(req, res);
}

module.exports = {
  userRegister,
  userLogin,
  getAllUsers,
  updateUser,
  uploadProfilePic,
  logoutUser,
  getUser,
  authCallback,
  googleAuth
};
