import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import validator from "validator";

// login function
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User not found"})
        }

        const isMatch = await bcryptjs.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid password"})
        }

        const token = createToken(user._id);
        res.json({success: true, token, user: {_id: user._id}});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Server error"})
    }
}

// tạo token
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

// register function
const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try{
        // kiểm tra email đã tồn tại hay chưa
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success: false, message: "User already exists"})
        }

        // kiểm tra định dạng email & password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Invalid email"})
        }
        if(password.length < 8){
            return res.json({success: false, message: "Password must be at least 8 characters long"})
        }

        // mã hóa password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token})

    }catch (error) {
        console.log(error);
        res.json({success: false, message: "Server error"})
    }
}

// Lấy thông tin người dùng
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Lấy từ authMiddleware
    const user = await userModel.findById(userId).select("name email");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to fetch user profile" });
  }
};

export { loginUser, registerUser, getUserProfile };