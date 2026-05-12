import React, { useContext, useEffect, useState } from "react";
import { FaStar, FaHeart, FaMinus, FaPlus } from "react-icons/fa6";
import { ShopContext } from "../context/ShopContext";
import { LuMoveUpRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductMd = ({ product, refreshTrigger}) => {
  const { addToCart, removeFromCart, cartItems, url } = useContext(ShopContext);
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Lấy dữ liệu đánh giá từ API
useEffect(() => {
  const fetchRatingAndReviewCount = async () => {
    try {
      const res = await axios.get(`${url}/api/product/reviews/${product._id}`);
      if (res.data.success) {
        const reviews = [];
        for (const review of res.data.reviews) {
          const ipfsRes = await fetch(`https://gateway.pinata.cloud/ipfs/${review.ipfsHash}`);
          const data = await ipfsRes.json();

          if (data.rating === undefined) continue; // Bỏ nếu không có rating

          reviews.push(data.rating);
        }

        setReviewCount(reviews.length);

        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, rating) => sum + rating, 0);
          const avgRating = totalRating / reviews.length;
          setAverageRating(avgRating);
        } else {
          setAverageRating(0);
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy rating từ IPFS:", err);
      setAverageRating(0);
      setReviewCount(0);
    }
  };

  fetchRatingAndReviewCount();
}, [product._id, refreshTrigger]);

// Hàm hiển thị số sao
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      // Ngôi sao đầy đủ
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (i - 1 < rating && rating < i) {
      // Ngôi sao một nửa (nếu có phần thập phân)
      stars.push(<FaStar key={i} className="text-yellow-500 opacity-50" />);
    } else {
      // Ngôi sao rỗng
      stars.push(<FaStar key={i} className="text-gray-300" />);
    }
  }
  return stars;
};

  return (
    <section className="max-padd-container flex flex-col xl:flex-row gap-10 py-8 bg-primary">
      {/* Left Side */}
      <div className="flex gap-4 xl:flex-1">
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, idx) => (
            <img
              key={idx}
              src={`${url}/images/${product.image}`}
              alt="product thumbnail"
              className="h-20 w-20 object-cover rounded-md border"
            />
          ))}
        </div>
        <div className="max-h-[500px] w-full flex justify-center items-center overflow-hidden rounded-xl bg-gray-100">
          <img
            src={url + "/images/" + product.image}
            alt="bigImg"
            className="object-contain w-full h-full"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1 bg-white p-8 rounded-xl shadow-md">
        <h1 className="font-bold text-2xl mb-4">{product.name}</h1>
        <div className="flex items-center justify-between mb-6">
  <span className="text-xl font-semibold">${product.price}</span>
  <div className="flex items-center gap-1 text-sm">
    <div className="flex">
      {renderStars(averageRating)}
    </div>
    <span className="text-gray-600 ml-1">
      {averageRating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
    </span>
  </div>
</div>

        {/* Color + Size */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-2">Color</h4>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-red-400 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-yellow-400 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-blue-400 cursor-pointer"></div>
              <div className="w-8 h-8 rounded-full bg-green-400 cursor-pointer"></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Size</h4>
            <div className="flex gap-2">
              {["S", "M", "L", "XL"].map((size) => (  
                <div
                  key={size}
                  className="border rounded-md w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button className="btn-secondary flex items-center justify-center rounded-md p-2">
            <FaHeart className="text-xl" />
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="btn-dark flex items-center justify-center gap-2 rounded-md px-6 py-2"
          >
            Go to Cart <LuMoveUpRight />
          </button>

          {!cartItems[product._id] ? (
            <button
              onClick={() => addToCart(product._id)}
              className="bg-tertiary text-white rounded-md px-4 py-2 flex items-center justify-center"
            >
              <FaPlus />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => removeFromCart(product._id)}
                className="h-8 w-8 bg-tertiary text-white flexCenter rounded-sm"
              >
                <FaMinus />
              </button>
              <span className="text-lg font-semibold">
                {cartItems[product._id]}
              </span>
              <button
                onClick={() => addToCart(product._id)}
                className="h-8 w-8 bg-secondary text-white flexCenter rounded-sm"
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>
            <strong>Category:</strong> Women | Jacket | Winter
          </p>
          <p>
            <strong>Tags:</strong> Modern | New Arrivals
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductMd;