const express = require("express");
const router = express.Router();
const Subscription = require("../models/subscriptionModel");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new subscription
router.post("/", authMiddleware, async (req, res) => {
    const { boxType, endDate } = req.body;
    try {
        const subscription = new Subscription({
            user: req.userId,
            boxType,
            endDate,
        });
        await subscription.save();
        res.status(201).json(subscription);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get all subscriptions for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.userId });
        res.json(subscriptions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Update a subscription
router.put("/:id", authMiddleware, async (req, res) => {
    const { boxType, endDate, isActive } = req.body;
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        if (subscription.user.toString() !== req.userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        subscription.boxType = boxType || subscription.boxType;
        subscription.endDate = endDate || subscription.endDate;
        subscription.isActive = isActive !== undefined ? isActive : subscription.isActive;
        await subscription.save();
        res.json(subscription);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Delete a subscription
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        if (subscription.user.toString() !== req.userId) {
            return res.status(401).json({ message: "User not authorized" });
        }
        await subscription.remove();
        res.json({ message: "Subscription removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
