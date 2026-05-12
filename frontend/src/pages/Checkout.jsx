import React, { useContext, useState, useEffect, useRef } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MetaMaskOnboarding from '@metamask/onboarding';

const Checkout = ({setShowWallet}) => {
  const { url, token } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { orderData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const onboarding = useRef(null);

 useEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
    const installed = MetaMaskOnboarding.isMetaMaskInstalled();
    setIsMetaMaskInstalled(installed);

    if (installed && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }
  }, []);

const connectWallet = async () => {
  setIsLoading(true);

  if (!window.ethereum) {
    alert("MetaMask chưa được cài đặt!");
    setIsLoading(false);
    return;
  }

  try {
    // Kiểm tra nếu đã kết nối thì không cần yêu cầu lại
    const existingAccounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (existingAccounts.length > 0) {
      setAccount(existingAccounts[0]);
      setIsConnected(true);
      localStorage.setItem("walletAddress", existingAccounts[0]);
      setShowWallet(true);
      setIsLoading(false);
      return;
    }

    // Nếu chưa có, yêu cầu kết nối
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
      localStorage.setItem("walletAddress", accounts[0]);
      setShowWallet(true);
    }

  } catch (error) {
    if (error.code === 4001) {
      console.warn("Người dùng từ chối kết nối ví.");
    } else {
      console.error("Lỗi khi kết nối MetaMask:", error);
    }
  } finally {
    setIsLoading(false);
  }
};

  // const installMetaMask = () => {
  //   onboarding.current.startOnboarding();
  // };

  useEffect(() => {
    console.log("Checkout page - orderData:", orderData); // Debug log
    if (!orderData) {
      console.warn("No orderData received. Redirecting to /cart.");
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const confirmOrder = async () => {
    if (!orderData) {
      alert("No order data available. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/order/placeorder`,
        orderData,
        { headers: { token } }
      );
      if (response.data.success) {
        console.log("orderdata: ",orderData.items);
        console.log("✅ Lấy userId từ localStorage:", localStorage.getItem("userId"))
        navigate("/order-success", {
           state: { 
            orderId: response.data.orderId,
            productId: orderData.items.map(item => item._id),
            userId: localStorage.getItem("userId"),
            total: amount.toFixed(2),
            addresWallet: localStorage.getItem("walletAddress"),
          } });
      } else {
        alert(response.data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!orderData) {
    return <div className="max-padd-container py-28">No order data available. Redirecting...</div>;
  }

  const { address, items, amount } = orderData;

  return (
    <section className="max-padd-container py-28 xl:py-32">
      <h2 className="bold-28 mb-8">Checkout</h2>
      <div className="flex flex-col xl:flex-row gap-10 xl:gap-20">
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="bold-22">Delivery Information</h3>
          <div className="bg-gray-100 p-4 rounded-sm">
            <p><strong>Name:</strong> {address.firstName} {address.lastName}</p>
            <p><strong>Email:</strong> {address.email}</p>
            <p><strong>Phone:</strong> {address.phone}</p>
            <p><strong>Address:</strong> {address.street}, {address.city}, {address.state}, {address.zipcode}, {address.country}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <h3 className="bold-22">Order Details</h3>
          <div className="bg-gray-100 p-4 rounded-sm">
            {items.map((item, index) => (
              <div key={index} className="flexBetween py-2">
                <div>
                  <p className="medium-16">{item.name}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <p className="medium-16 font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flexBetween py-2">
              <p className="medium-16">Subtotal:</p>
              <p className="medium-16 font-semibold">${(amount - 2).toFixed(2)}</p>
            </div>
            <div className="flexBetween py-2">
              <p className="medium-16">Shipping Fee:</p>
              <p className="medium-16 font-semibold">$2.00</p>
            </div>
            <hr className="my-2" />
            <div className="flexBetween py-2">
              <p className="bold-18">Total:</p>
              <p className="bold-18">${amount.toFixed(2)}</p>
            </div>
          </div>

          {!isMetaMaskInstalled ? (
            <div>
              <h4 className="bold-22 mt-6">Connect Wallet to pay.</h4>
              <p className="text-gray-500 mb-4">
                Please connect your wallet to proceed with the payment.
              </p>
              <button
                onClick={() => setShowWallet(true)}
                className="btn-secondary w-52 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Install MetaMask"}
              </button>
            </div>
          ) : !account ? (
            <div>
              <p className="text-gray-500 mb-4">Please connect your wallet to proceed with the payment.</p>
              <button onClick={connectWallet} className="btn-secondary w-52 rounded">
                Connect Wallet
              </button>
            </div>
          ) : (
            <button
              onClick={confirmOrder}
              className="btn-secondary w-52 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Checkout;