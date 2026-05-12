import axios from "axios";

const PINATA_API_KEY = "b023e2f484fa4de200a1";
const PINATA_SECRET_API_KEY = "b052a82ffef8183510116df7865bcbfa8487a0067f97dbafd32403cc274ea5a0";

export const uploadReviewToIPFS = async (reviewData, imageFiles = []) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const imageUrls = [];

  try {
    // 1. Upload từng ảnh lên Pinata
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);

      const imageRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        }
      });

        const hash = imageRes.data.IpfsHash;
        imageUrls.push(`https://gateway.pinata.cloud/ipfs/${hash}`);
      }

      // 2. Gộp imageUrls vào reviewData
      const finalData = {
        ...reviewData,
        images: imageUrls
      };

    const response = await axios.post(url, finalData, {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
        "Content-Type": "application/json",
      },
    });

    // response.data.IpfsHash là hash bạn cần
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Pinata upload error:", error);
    throw new Error("Failed to upload review to IPFS");
  }
};

export const fetchFromIPFS = async (ipfsHash) => {
  try {
    // Dùng gateway IPFS công khai của Pinata hoặc Cloudflare IPFS gateway
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    const response = await axios.get(url);
    return response.data; // JSON nội dung review
  } catch (error) {
    console.error("Failed to fetch data from IPFS:", error);
    throw new Error("Failed to fetch data from IPFS");
  }
};
