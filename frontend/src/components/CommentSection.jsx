import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { verifyMessage } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import { uploadReviewToIPFS, fetchFromIPFS } from "../utils/ipfs";
import { logReviewOnChain, getReviewsByProductId } from "../utils/reviewlogger";

const CommentSection = ({ productId }) => {
  const { token, user, addComment } = useContext(ShopContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Lấy cmt từ blockchain theo productId
      const cmt = await getReviewsByProductId(productId);
      

      // Lấy chi tiết từng review từ IPFS
      const detailedComments = await Promise.all(
        cmt.map(async (r) => {
          const data = await fetchFromIPFS(r.ipfsHash);
          if ("rating" in data) {
            return null;
          }
          return {
            username: data.user || "Anonymous",
            content: data.content,
            userAddress: r.user,
            timestamp: Number(r.timestamp) * 1000, // giả sử timestamp dạng UNIX seconds, chuyển thành ms
            ipfsHash: r.ipfsHash,
          };
        })
      );
      const filteredComments = detailedComments.filter((c) => c !== null);


      // Sắp xếp mới nhất lên đầu
      filteredComments.sort((a, b) => b.timestamp - a.timestamp);

      setComments(filteredComments);
    } catch (error) {
      console.error("Failed to fetch blockchain comments", error);
      toast.error("Failed to load comments from blockchain");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.warning("Please log in to comment");
      return;
    }
    if (!newComment.trim()) {
      toast.warning("Comment cannot be empty");
      return;
    }

    try {
      // 1. Upload comment lên IPFS
      const ipfsData = {
        productId,
        user: user.name || user.address || "Anonymous",
        content: newComment,
        createdAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadReviewToIPFS(ipfsData);

      if (!ipfsHash) {
        toast.error("Upload to IPFS failed");
        return;
      }
      toast.success("Comment uploaded to IPFS");
      console.log("thanh cong",ipfsHash);
      
      // 2. Tạo mesage JSON ký OF-chain
      const messageObj = {
        productId,
        ipfsHash,
        timestamp: Date.now(),
      };
      const message = JSON.stringify(messageObj);

      // 3. Ký message
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const signature = await provider.send("personal_sign", [message, address]);

      // 4. Verify chữ ký (bạn có thể bỏ phần này, nhưng demo để check)
      if (!verifySignature(message, signature, address)) {
        toast.error("Signature verification failed");
        return;
      }
      toast.success("Comment signed off-chain");

      localStorage.setItem("lastCommentSignature", JSON.stringify({
        message,
        signature,
        address,
      }));

      // Lưu comment mới vào state để UI cập nhật ngay
      setComments((prev) => [
        {
          username: user.name || user.address.slice(0, 6) + "..." + user.address.slice(-4),
          content: newComment,
          userAddress: address,
          timestamp: Date.now(),
          ipfsHash,
          signature,
          message,
        },
        ...prev,
      ]);

      // Ghi IPFS hash lên blockchain
      // await logReviewOnChain(productId, ipfsHash);
      // toast.success("Comment logged on blockchain");

      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to submit comment");
    }
  };

  const verifySignature = (message, signature, expectedAddress) => {
    try {
      const signerAddress = verifyMessage(message, signature);
      return signerAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error("Invalid signature verification:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  return (
    <div className="mt-8 w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Customer Comments</h3>

      {token && (
        <form onSubmit={handleSubmitComment} className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-2xl text-gray-400 mt-1">
              <FaUserCircle />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <FaPaperPlane size={14} />
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-left py-4 bg-white rounded-lg shadow-sm px-4">
            <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, idx) => (
            <div
              key={comment.ipfsHash || idx}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
                    {comment.username ? comment.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-base">{comment.username || "Unknown"}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-2 pl-12 text-base leading-relaxed">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
