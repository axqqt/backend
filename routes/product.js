const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new product (Admin only)
router.post("/", authMiddleware, async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const product = new Product({ name, price, description });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Get a single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Update a product (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        await product.save();
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// Delete a product (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.remove();
        res.json({ message: "Product removed" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
