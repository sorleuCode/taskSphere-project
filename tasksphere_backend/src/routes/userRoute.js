const express = require("express");
const router = express.Router();
const { userRegister, userLogin, getAllUsers, updateUser,logoutUser, getUser } = require("../controllers/userController");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/", getAllUsers)
router.get("/:userId", getUser)
router.put("/update/:id", updateUser)
router.post("/logout", logoutUser)

module.exports = router;
