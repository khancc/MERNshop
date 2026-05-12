// import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   content: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
// export default reviewModel;
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
