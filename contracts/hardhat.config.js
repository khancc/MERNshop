require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Ganache RPC
      // accounts: [
      //   "0x08a9b5b999a94275121bbeb32c2251f7ce3ae673d4c2e39871d1450f502e7584", // Dán private key từ Ganache ở đây (bỏ 0x nếu hardhat yêu cầu)
      //   // có thể thêm nhiều tài khoản nếu muốn
      // ]
    }
  },
  solidity: "0.8.28",
};
