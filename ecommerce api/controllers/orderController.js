const Order = require("../models/Order.js");
const Cart = require('../models/Cart.js');
const auth = require("../auth.js")

// Create Order
module.exports.createOrder = (req, res) => {
    const userId = req.user.id;

    Cart.findOne({ userId })
    .then(userCart => {
        if (!userCart) {
            return res.status(404).json({ error: "User's cart not found" });
        }

        // Check if the cart's cartItems array contains an item
        if (userCart.cartItems.length > 0) {
            // If cartItems array contains items, create a new Order document
            const newOrder = new Order({
                userId,
                productsOrdered: userCart.cartItems,
                totalPrice: userCart.totalPrice
            });

            // Save the new order to the database
            newOrder.save()
            .then(order => {
                res.status(201).json({
                	message: "Ordered successfully",
                	order 
                });
            })
            .catch(err => {
                console.error("Error creating order:", err);
                res.status(500).json({ error: "Internal server error" });
            });
        }

        else {
            // If cartItems array is empty, send a message to the client
            res.status(400).json({ error: "Cart is empty. Cannot create order." });
        }
    })
    .catch(err => {
        console.error("Error finding user's cart:", err);
        res.status(500).json({ error: "Internal server error" });
    });
};


// Get Order
module.exports.getMyOrders = (req, res) => {
    const userId = req.user.id;

    Order.find({ userId })
    .then(orders => {
        // If no orders found, send a message to the client
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for the current user" });
        }

        // If orders found, send them to the client
        res.status(200).json({
        	orders: orders
        });
    })
    .catch(err => {
        console.error("Error finding user's orders:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
};


// All Orders
module.exports.getAllMyOrders = (req, res) => {
    Order.find()
    .then(orders => {
        res.status(200).json({
        	orders: orders
        });
    })
    .catch(err => {
        console.error("Error finding all orders:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    });
};