import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderPopup } from "../components/OrderPopup";
import { sendEthViaContract } from "../utils/contract";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, productId, userId, total } = state || {};
  const [errorMsg, setErrorMsg] = useState("");
  const [popupStatus, setPopupStatus] = useState("processing"); // 'processing', 'success', 'failed'
  const [viewStatus, setViewStatus] = useState("processing");   // để điều khiển phần nội dung chính
  const hasPaidRef = useRef(false);

  useEffect(() => {
    const pay = async () => {
      if (hasPaidRef.current) return;
      hasPaidRef.current = true;

      if (!orderId || !productId || !total || !userId) {
        console.log("❌ Dữ liệu thiếu: ", { orderId, productId, total, userId });
        setErrorMsg("Thiếu thông tin giao dịch");
        setPopupStatus("failed");
        return;
      }

      try {
        console.log("🔍 orderId:", orderId);
        console.log("🔍 productId:", productId);
        console.log("🔍 userId:", userId);
        console.log("🔍 total:", total);
        const txHash = await sendEthViaContract(orderId, productId, userId, total); // <-- chỉ gọi contract
        console.log("✅ Giao dịch thành công:", txHash);

        setPopupStatus("success");
        setViewStatus("success");
        setTimeout(() => {
          setPopupStatus(false);
          // navigate("/"); // tuỳ ý chuyển trang
        }, 2000);
      } catch (err) {
        console.error("❌ Lỗi gửi qua contract:", err.message);
        setErrorMsg(err.message || "Lỗi không xác định");
        setPopupStatus("failed");
        setViewStatus("failed");

        setTimeout(() => {
          setPopupStatus(false);
        }, 2000);
      }
    };

    pay();
  }, [orderId, productId, userId, total]);

  return (
  <section className="max-w-screen-md mx-auto px-4 py-20 sm:py-24 lg:py-32 text-center">
    <OrderPopup status={popupStatus} message={popupStatus === "failed" ? errorMsg : undefined} />

    {viewStatus === "failed" ? (
      <>
        <h2 className="text-red-600 text-2xl font-bold mb-4">Order Failed!</h2>
        <p className="mb-2 text-gray-700">There was a problem processing your payment.</p>
        {/* <p className="text-sm text-gray-600">{errorMsg}</p> */}
        <button
          onClick={() => navigate("/")}
          className="btn-secondary w-full sm:w-52 rounded mt-6"
        >
          Back to Home
        </button>
      </>
    ) : (
      <>
        <h2 className="text-green-600 text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-700">
          Thank you for your order. Your order ID is: <strong>{orderId || "N/A"}</strong>.
        </p>
        <p className="text-gray-600 mt-1">You will receive a confirmation soon.</p>
        <button
          onClick={() => navigate("/")}
          className="btn-secondary w-full sm:w-52 rounded mt-6"
        >
          Back to Home
        </button>
      </>
    )}
  </section>
);


};

export default OrderSuccess;