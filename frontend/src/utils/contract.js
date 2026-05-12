import { ethers } from "ethers";
import addresses from '../../../contracts/deployedAddresses.json';

const CONTRACT_ADDRESS = addresses.TransactionLogger; // địa chỉ contract đã deploy
const CONTRACT_ABI = [
  "function logTransaction(bytes32 orderId, bytes32[] productIds, bytes32 userId) public payable",
  "function getTransactionCount() view returns (uint256)",
  "function getTransaction(uint256 index) view returns (bytes32,bytes32[],bytes32,address,uint256,uint256)",
  "function hasPurchasedProduct(bytes32 userId, bytes32 productId) view returns (bool)" // optional
];

export const sendEthViaContract = async (orderIdString, productIdsAray, userIdStr, totalUSD) => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  // Tạm thời hardcode tỉ giá
  const ETH_USD_RATE = 3000;
  const ethAmount = (totalUSD / ETH_USD_RATE).toFixed(5);
  const value = ethers.parseEther(ethAmount);

  const orderId = ethers.id(orderIdString); // string → bytes32
  const productIds = productIdsAray.map(id => ethers.id(id));
  const userId = ethers.id(userIdStr); // string → bytes32

  const tx = await contract.logTransaction(orderId, productIds, userId, { value });
  await tx.wait();

  return tx.hash;
};
export const hasPurchasedProduct = async (userIdStr, productIdStr) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

  const userId = ethers.id(userIdStr);
  const productId = ethers.id(productIdStr);

  return await contract.hasPurchasedProduct(userId, productId);
};