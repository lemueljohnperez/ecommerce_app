// Dependencies and Modules
const express = require("express");

// Routing Component
const router = express.Router();
const userController = require("../controllers/userController.js");

//Import the auth module and deconstruct it to get our verify method
const { verify, verifyAdmin } = require("../auth.js");

// Register User
router.post("/", userController.registerUser);
 
// Login User
router.post("/login", userController.loginUser);

// Get User Profile
router.get("/details", verify, userController.getProfile);

// Update User
router.patch('/:userId/set-as-admin', verify, verifyAdmin, userController.updateUser);

// Update Password
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;