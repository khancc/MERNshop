import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reviews = ({ url }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/api/product/reviews`, {
        headers: { token: localStorage.getItem("adminToken") },
      });
      console.log("Response from backend:", response.data);
      console.log("Reviews received:", response.data.reviews);
      if (response.data.success) {
        const reviewList = [];
        console.log("Response from backend:", response.data);

        for (const review of response.data.reviews) {
          try {
            if (!review.ipfsHash) {
              console.warn("ipfsHash is undefined, skipping...");
              continue;
            }
            const ipfsRes = await fetch(`https://gateway.pinata.cloud/ipfs/${review.ipfsHash}`);
            const data = await ipfsRes.json();

            if (data.rating === undefined) continue;

            reviewList.push({
              ...data,
              createdAt: review.createdAt,
              productId: review.productId,
              userId: {
                name: data.user || "Anonymous",
              },
              images: data.images || [],
            });
          } catch (ipfsError) {
            console.warn(`Failed to load IPFS data for hash ${review.ipfsHash}`);
          }
        }

        setReviews(reviewList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Manage Reviews</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No reviews found
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                    {review.userId.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{review.userId.name}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Hiển thị ảnh nếu có */}
                {review.images.length > 0 && (
                  <div className="flex gap-2 mb-2 overflow-x-auto">
                    {review.images.map((imgUrl, i) => (
                      <img
                        key={i}
                        src={imgUrl}
                        alt={`Review Image ${i + 1}`}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                <p className="text-gray-700 mb-2">{review.content}</p>
                <div className="text-sm text-gray-500">
                  <span>Product ID: {review.productId}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
