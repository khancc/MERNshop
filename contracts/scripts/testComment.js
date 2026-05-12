const hre = require("hardhat");

async function main() {
  const Comment = await hre.ethers.getContractFactory("CommentContract");
  const comment = await Comment.deploy();
  await comment.waitForDeployment();

  const address = await comment.getAddress();
  console.log("Đã deploy CommentContract tại:", address);

  // Gửi comment
  const tx = await comment.addComment("Chất lượng tuyệt vời!");
  await tx.wait();
  console.log("Đã thêm comment!");

  // Đọc lại
  const comments = await comment.getComments();
  console.log("Danh sách comment:", comments);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
