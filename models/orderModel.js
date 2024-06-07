const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }],
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }, // Possible values: Pending, Completed, Cancelled
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
