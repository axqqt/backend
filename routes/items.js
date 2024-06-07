const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Product = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new item (Admin only)
router.post("/", authMiddleware, async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const item = new Item({ name, price, description });
        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get all items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get a single item
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Update an item (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.name = name || item.name;
        item.price = price || item.price;
        item.description = description || item.description;
        await item.save();
        res.json(item);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Delete an item (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        await item.remove();
        res.json({ message: "Item removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
