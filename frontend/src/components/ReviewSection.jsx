import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { ShopContext } from "../context/ShopContext";
import { FaStar, FaRegStar, FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadReviewToIPFS } from "../utils/ipfs";
import { hasPurchasedProduct } from "../utils/contract"; // Giả sử bạn có hàm này để kiểm tra mua hàng
// import {logReviewOnChain, getReviewCountFromContract, getReviewFromContract} from "../utils/reviewlogger";

const ReviewSection = ({ productId, onReviewSubmitted  }) => {
  const { url, token, user } = useContext(ShopContext);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [canReview, setCanReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewImages, setReviewImages] = useState([]);

  //lấy từ blockchain
  // const fetchReviews = async () => {
  //   try {
  //     setLoading(true);
  //     const reviewCount = await getReviewCountFromContract();
  //     const reviewsOnChain = [];

  //     const productHash = ethers.id(productId);

  //     for (let i = 0; i < reviewCount; i++) {
  //       const [productIdHash, reviewer, ipfsHash, timestamp] = await getReviewFromContract(i);

  //       if (productIdHash === productHash) {
  //         console.log(ipfsHash);
  //         const res = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
  //         const data = await res.json();
  //         if (data.rating === undefined) {
  //           continue; // bỏ qua nếu không có rating
  //         }
  //         reviewsOnChain.push({
  //           ...data,
  //           userId: { 
  //             name: data.user || reviewer.slice(0, 6) + "..." + reviewer.slice(-4) },
  //           createdAt: Number(timestamp) * 1000
  //         });
  //       }
  //     }

  //     setReviews(reviewsOnChain.sort((a, b) => b.createdAt - a.createdAt));
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to load reviews from blockchain");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //lấy thông qua backend
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/user/profile`, {
        headers: { token }
      });

      if (res.data.success) {
        return res.data.data.name; // Trả về tên người dùng
      } else {
        console.warn("Không lấy được profile người dùng");
        return "Anonymous";
      }
    } catch (err) {
      console.error("Lỗi khi lấy thông tin người dùng:", err);
      return "Anonymous";
    }
  };
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/product/reviews/${productId}`);
      if (res.data.success) {
        const reviewsOnChain = [];
        for (const review of res.data.reviews) {
          // review.ipfsHash có thể dùng để fetch nội dung chi tiết từ IPFS
          const ipfsRes = await fetch(`https://gateway.pinata.cloud/ipfs/${review.ipfsHash}`);
          const data = await ipfsRes.json();
          if (data.rating === undefined) continue; // bỏ review không có rating

          reviewsOnChain.push({
            ...data,
            createdAt: new Date(review.createdAt),
            productId: review.productId,
            userId: {
              name: data.user || "Anonymous"  // dùng user từ IPFS, nếu không có thì đặt "Anonymous"
            },
            images: data.images || [] // Lấy images nếu có
          });
        }
        setReviews(reviewsOnChain.sort((a, b) => b.createdAt - a.createdAt));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reviews from backend/IPFS");
    } finally {
      setLoading(false);
    }
  };

  const checkCanReview = async () => {
    if (!token) {
      setCanReview(false);
      setErrorMessage("Vui lòng đăng nhập để đánh giá");
      return;
    }
    

    try {
      const decoded = JSON.parse(atob(token.split(".")[1])); // nếu token là JWT
      const userId =  localStorage.getItem("userId") || decoded.userId;
      console.log("Decoded token:", decoded);
      console.log("User ID:", userId);
      console.log("Product ID:", productId);

      if (!userId) {
        setCanReview(false);
        setErrorMessage("Không tìm thấy thông tin người dùng");
        return;
      }

      const purchased = await hasPurchasedProduct(userId, productId);

      if (purchased) {
        setCanReview(true);
        setErrorMessage("");
      } else {
        setCanReview(false);
        setErrorMessage("Bạn cần mua sản phẩm để đánh giá");
      }
    } catch (error) {
      console.error("Lỗi kiểm tra quyền đánh giá:", error);
      setCanReview(false);
      setErrorMessage("Không thể kiểm tra quyền đánh giá");
    }
};


  const handleSubmitReview = async (e) => {
  e.preventDefault();

  //   if (!window.ethereum) {
  //     toast.warning("Please install MetaMask");
  //     return;
  //   }

  if (!newReview.trim()) {
    toast.warning("Review cannot be empty");
    return;
  }

  setLoading(true);

    try {
      const username = await fetchUserProfile();
      const reviewData = {
        productId,
        user: username,
        rating,
        content: newReview,
        timestamp: new Date().toISOString()
      };
      console.log("Sending reviewData to Pinata:", reviewData);

       // Upload lên IPFS
      const ipfsHash = await uploadReviewToIPFS(reviewData, reviewImages);
      if (!ipfsHash) {
        toast.error("Failed to upload review to IPFS");
        setLoading(false);
        return;
      }
      console.log("thanh cong ", ipfsHash);
      // await logReviewOnChain(productId, ipfsHash);
      // toast.success("Review submitted on blockchain!");
      // setNewReview("");
      // setRating(5);
      // fetchReviews();
      
      // Gửi ipfsHash + productId về backend để lưu (bỏ qua blockchain)
      const res = await axios.post(
        `${url}/api/product/reviews`,
        { productId, ipfsHash },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Review saved successfully!");
        setNewReview("");
        setReviewImages([]); 
        setRating(5);
        fetchReviews();
        onReviewSubmitted && onReviewSubmitted();
      } else {
        toast.error("Failed to save review: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    }
    setLoading(false);
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );
  };

  useEffect(() => {
    console.log("Token:", token);
    fetchReviews();
    checkCanReview();
    // setCanReview(true); // For testing purposes, allow all reviews
  }, [productId, token]);

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Customer Ratings & Reviews</h3>

      {/* Review Form */}
      {token && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          {canReview ? (
            <form onSubmit={handleSubmitReview}>
              <div className="flex items-start gap-3">
                <div className="text-2xl text-gray-400 mt-1">
                  <FaUserCircle />
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Rating:
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setRating(num)}
                          className="text-xl focus:outline-none"
                        >
                          {num <= rating ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-yellow-400" />
                          )}
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
                    </div>
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your honest thoughts about this product..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows="4"
                  />
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images:</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setReviewImages([...e.target.files])}
                      className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FaPaperPlane size={14} />
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-4 text-red-500 text-sm">{errorMessage}</div>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
                  {review.userId.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-base">
                        {review.userId.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderRatingStars(review.rating)}
                        <span className="ml-1 text-sm text-gray-600">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mt-2 pl-12 text-base leading-relaxed">
                {review.content}
              </p>
              {/* Hiển thị hình ảnh nếu có */}
              {review.images && review.images.length > 0 && (
                <div className="pl-12 mt-3 flex flex-wrap gap-3">
                  {review.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`review-${idx}`}
                      className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;