import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        // Validation dữ liệu đầu vào
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Items are required and must be a non-empty array" });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount" });
        }
        if (!address || !address.firstName || !address.email) {
            return res.status(400).json({ success: false, message: "Address information is incomplete" });
        }

        const newOrder = new orderModel({
            userId: req.user.userId,
            items,
            amount,
            address,
            payment: false, // Đặt mặc định là chưa thanh toán
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully", orderId: newOrder._id });
    } catch (error) {
        console.error("Error in placeOrder:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Xác thực đơn hàng (có thể giữ nguyên hoặc bỏ nếu không cần)
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment confirmed" });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment not confirmed" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Đơn hàng user frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Đơn hàng admin frontend
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API cập nhật trạng thái đơn hàng
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error updating status" });
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };