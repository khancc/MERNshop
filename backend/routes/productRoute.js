// import express from "express";
// import {
//   addProduct,
//   listProduct,
//   removeProduct,
//   // createComment,
//   // getComments,
//   // getAllComments,
//   // deleteComment,
//   // createReview,
//   // getReviews,
//   // getAllReviews,
//   // deleteReview,
//   checkReviewPermission, // Import hàm mới
// } from "../controllers/productController.js";
// import multer from "multer";
// // import authMiddleware from "../middleware/auth.js";

// const productRouter = express.Router();

// const storage = multer.diskStorage({
//   destination: "uploads",
//   filename: (req, file, cb) => {
//     return cb(null, `${Date.now()}${file.originalname}`);
//   },
// });

// const upload = multer({ storage: storage });

// productRouter.post("/add", upload.single("image"), addProduct);
// productRouter.get("/list", listProduct);
// productRouter.post("/remove", removeProduct);

// // Routes cho bình luận
// // productRouter.post("/comments", authMiddleware, createComment);
// // productRouter.get("/comments/all", getAllComments);
// // productRouter.get("/comments/:productId", getComments);
// // productRouter.post("/comments/delete", deleteComment);

// // Routes cho đánh giá
// // productRouter.post("/reviews", authMiddleware, createReview);
// // productRouter.get("/reviews/all", getAllReviews);
// // productRouter.get("/reviews/:productId", getReviews);
// // productRouter.post("/reviews/delete", deleteReview);
// // productRouter.post("/reviews/check", authMiddleware, checkReviewPermission);

// export default productRouter;
import express from "express";
import multer from "multer";
import {
  addProduct,
  listProduct,
  removeProduct,
  createReview,
  getReviewsByProductId,
  getAllReviews,
} from "../controllers/productController.js";
// import authMiddleware from "../middleware/auth.js";

const productRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

productRouter.post("/add", upload.single("image"), addProduct);
productRouter.get("/list", listProduct);
productRouter.post("/remove", removeProduct);

// Review routes
productRouter.post("/reviews", /*authMiddleware,*/ createReview);
productRouter.get("/reviews/:productId", getReviewsByProductId);
productRouter.get("/reviews", getAllReviews);

// Nếu cần check quyền review
// productRouter.post("/reviews/check", authMiddleware, checkReviewPermission);

export default productRouter;

