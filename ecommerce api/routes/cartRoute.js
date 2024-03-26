// Dependencies and Modules
const express = require("express");

//[Routing Component] 
const router = express.Router();
const cartController = require("../controllers/cartController.js");

//Import the auth module and deconstruct it to get our verify method
const {verify, verifyAdmin} = require("../auth");

// Retrieve User's Cart
router.get("/get-cart", verify, cartController.getUserCart);

// Add to cart 
router.post("/add-to-cart", verify, cartController.addToCart);

// Change Product Quatities in Cart
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Remove Item from Cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeItem);

// Clear-Cart
router.put("/clear-cart", verify, cartController.clearCartItems);

module.exports = router;