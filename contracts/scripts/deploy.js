// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🚀 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const adminAddress = "0xYourAdminAddressHere"; // Thay bằng địa chỉ admin thực tế
  // Deploy TransactionLogger
  const TransactionLogger = await ethers.getContractFactory("TransactionLogger");
  const transactionLogger = await TransactionLogger.deploy();
  await transactionLogger.waitForDeployment();
  const transactionLoggerAddress = await transactionLogger.getAddress();
  console.log("✅ TransactionLogger deployed at:", transactionLoggerAddress);

  // Deploy ReviewLogger
  const ReviewLogger = await ethers.getContractFactory("ReviewLogger");
  const reviewLogger = await ReviewLogger.deploy();
  await reviewLogger.waitForDeployment();
  const reviewLoggerAddress = await reviewLogger.getAddress();
  console.log("✅ ReviewLogger deployed at:", reviewLoggerAddress);

  // Nếu muốn ghi ra file JSON địa chỉ contract để frontend dùng:
  const fs = require("fs");
  fs.writeFileSync(
    "deployedAddresses.json",
    JSON.stringify({
      TransactionLogger: transactionLoggerAddress,
      ReviewLogger: reviewLoggerAddress,
    }, null, 2)
  );
  console.log("📄 Addresses saved to deployedAddresses.json");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
