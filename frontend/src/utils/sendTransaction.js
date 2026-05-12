import { ethers } from "ethers";

const RECEIVER_ADDRESS = "0xabcAA7C1A4060eb44E9f4A5aB40C30b1895BA629";

export const sendTransaction = async (amountUSD, senderAccount) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const ETH_RATE = 3000; // giả định tỉ giá USD/ETH
    const ethAmount = (amountUSD / ETH_RATE).toFixed(18); // 18 chữ số thập phân

    if (Number(ethAmount) <= 0) {
      throw new Error("Số tiền ETH gửi phải lớn hơn 0");
    }

    console.log(`Sending ${ethAmount} ETH to ${RECEIVER_ADDRESS}...`);

    const tx = await signer.sendTransaction({
      to: RECEIVER_ADDRESS,
      value: ethers.parseEther(ethAmount),
    });

    console.log("Transaction sent:", tx.hash);

    await tx.wait();

    console.log("Transaction confirmed!");

    return {
      success: true,
      hash: tx.hash,
      amount: ethAmount,
      from: senderAccount,
      to: RECEIVER_ADDRESS,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error: error.message };
  }
};
