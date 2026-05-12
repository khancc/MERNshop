import React, { useEffect, useState } from "react";
import { FiEdit2, FiSave } from "react-icons/fi";
import { ethers } from "ethers";


const Wallet = () => {
  const [walletAddress, setWalletAddress] = useState(""); // không dùng giả định
  const [totalBalance, setTotalBalance] = useState("0.00 ETH");
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  
  const fetchBalance = async (address) => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum); // hoặc dùng JsonRpcProvider nếu không có MetaMask
        const balance = await provider.getBalance(address);
        const ethValue = ethers.formatEther(balance);
        setTotalBalance(`${parseFloat(ethValue).toFixed(4)} ETH`);
      } catch (err) {
        console.error("Lỗi khi lấy số dư:", err);
        setTotalBalance("0.00 ETH");
      }
    };
  // Lấy địa chỉ ví từ backend
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/admin/wallet");
        const data = await res.json();
        if (data.address) {
          setWalletAddress(data.address || "");
          setTempAddress(data.address || "");

          // Gọi hàm lấy số dư thực từ blockchain
          fetchBalance(data.address);
        }
        
      } catch (err) {
        console.error("Lỗi khi tải địa chỉ ví:", err);
      }
    };

    fetchWallet();

    // Giả lập dữ liệu giao dịch
    // setTotalBalance("2.53 ETH");
    setTransactions([
      {
        date: "2025-05-28",
        amount: "0.5 ETH",
        to: "0xabc...789",
        status: "Success",
      },
      {
        date: "2025-05-26",
        amount: "1.0 ETH",
        to: "0xdef...123",
        status: "Success",
      },
    ]);
  }, []);

  // Lưu địa chỉ ví mới
  const handleSave = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/admin/wallet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: tempAddress }),
    });

    if (!res.ok) {
      throw new Error("Cập nhật địa chỉ ví thất bại");
    }

    const data = await res.json();
    setWalletAddress(data.address); // cập nhật UI
    setEditing(false);
    fetchBalance(data.address);
  } catch (err) {
    console.error(err);
    alert("Đã xảy ra lỗi khi lưu địa chỉ ví.");
  }
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Wallet</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số tài khoản / Địa chỉ ví
        </label>
        <div className="flex items-center gap-2">
          <input
            value={editing ? tempAddress : walletAddress}
            onChange={(e) => setTempAddress(e.target.value)}
            disabled={!editing}
            className={`w-full p-2 rounded border ${
              editing ? "border-indigo-400 bg-white" : "border-gray-300 bg-gray-100"
            } text-gray-700 transition`}
          />
          {editing ? (
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 p-2"
              title="Lưu"
            >
              <FiSave className="text-xl" />
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800 p-2"
              title="Chỉnh sửa"
            >
              <FiEdit2 className="text-xl" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Tổng số dư:</h3>
        <p className="text-2xl font-bold text-indigo-600">{totalBalance}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Lịch sử giao dịch</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Ngày</th>
                <th className="px-4 py-2 text-left">Số tiền</th>
                <th className="px-4 py-2 text-left">Người nhận</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{tx.date}</td>
                  <td className="px-4 py-2">{tx.amount}</td>
                  <td className="px-4 py-2">{tx.to}</td>
                  <td className="px-4 py-2">
                    <span className="text-green-600 font-medium">{tx.status}</span>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                    Không có giao dịch nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
