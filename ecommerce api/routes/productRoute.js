// Dependencies and Modules
const express = require("express");

//[Routing Component] 
const router = express.Router();
const productController = require("../controllers/productController.js");

//Import the auth module and deconstruct it to get our verify method
const {verify, verifyAdmin} = require("../auth");

// Add Product
router.post("/", verify, verifyAdmin, productController.addProduct);

// Get All Product
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

// Get All Active Products
router.get("/", productController.getAllActiveProducts);

// Get Single Product
router.get("/:productId", productController.getProduct);

// Update Product
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// Archive Product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Activate Product
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search products by name
router.post("/searchByName", productController.searchProductsByName);

// Search products by price
router.post("/searchByPrice", productController.searchProductsByPrice);

module.exports = router;