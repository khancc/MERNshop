import express from "express";
import { loginUser, registerUser, getUserProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/profile", authMiddleware, getUserProfile);

export default userRouter;