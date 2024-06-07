const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new order
router.post("/", authMiddleware, async (req, res) => {
    const { subscriptionId, productIds } = req.body;
    try {
        // Check if all products are valid
        const products = await Product.find({ _id: { $in: productIds } });
        if (products.length !== productIds.length) {
            return res.status(400).json({ message: "Invalid products in the order" });
        }

        const order = new Order({
            user: req.userId,
            subscription: subscriptionId,
            items: productIds,
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get all orders for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).populate('items').populate('subscription');
        res.json(orders);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Update an order status
router.put("/:id", authMiddleware, async (req, res) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.user.toString() !== req.userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        order.status = status || order.status;
        await order.save();
        res.json(order);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Delete an order
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.user.toString() !== req.userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        await order.remove();
        res.json({ message: "Order removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
