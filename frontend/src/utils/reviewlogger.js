// utils/reviewLogger.js
import { ethers } from "ethers";
import addresses from '../../../contracts/deployedAddresses.json';

const CONTRACT_ADDRESS = addresses.ReviewLogger;// địa chỉ sau khi deploy
const ABI = [
  "function logReview(bytes32,string) public",
  "function getReview(uint256) view returns (bytes32,address,string,uint256)",
  "function getReviewCount() view returns (uint256)"
];

export const logReviewOnChain = async (productId, ipfsHash) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const productIdHash = ethers.id(productId);
  const tx = await contract.logReview(productIdHash, ipfsHash);
  await tx.wait();
  return tx.hash;
};

export const getReviewFromContract = async (index) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  return await contract.getReview(index);
};

export const getReviewCountFromContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  return await contract.getReviewCount();
};

export const getReviewsByProductId = async (productId) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const count = await contract.getReviewCount();
  const productIdHash = ethers.id(productId);

  const allReviews = [];

  for (let i = 0; i < Number(count); i++) {
    const [storedHash, user, ipfsHash, timestamp] = await contract.getReview(i);
    if (storedHash === productIdHash) {
      allReviews.push({
        user,
        ipfsHash,
        timestamp: Number(timestamp),
      });
    }
  }

  return allReviews;
};
