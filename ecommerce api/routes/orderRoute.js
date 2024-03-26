// Dependencies and Modules
const express = require("express");

//[Routing Component] 
const router = express.Router();
const orderController = require("../controllers/orderController.js");

//Import the auth module and deconstruct it to get our verify method
const {verify, verifyAdmin} = require("../auth");

// Create Order
router.post("/checkout", verify, orderController.createOrder);

// Retrieve logged in user's orders
router.get("/my-orders", verify, orderController.getMyOrders);

// Retrieve all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllMyOrders);

module.exports = router;