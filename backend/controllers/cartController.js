import userModel from '../models/userModel.js';

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.user.userId });
        let cartData = userData.cartData || {}; // Đảm bảo cartData tồn tại
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.user.userId, { cartData });
        res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error in adding to cart' });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.userId);
        let cartData = userData.cartData || {};
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }
        await userModel.findByIdAndUpdate(req.user.userId, { cartData });
        res.json({ success: true, message: 'Removed from cart' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error in removing from cart' });
    }
};

// Lấy danh sách sản phẩm trong giỏ hàng
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.user.userId);
        let cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Error in getting cart' });
    }
};

export { addToCart, removeFromCart, getCart };