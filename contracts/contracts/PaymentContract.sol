// contracts/TransactionLogger.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionLogger {
    struct Transaction {
        bytes32 orderId;
        bytes32[] productIds;
        bytes32 userId;
        address sender;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    event TransactionLogged(bytes32 orderId,bytes32[] productIds, bytes32 userId, address sender, uint256 amount, uint256 timestamp);

    function logTransaction(bytes32 orderId, bytes32[] memory productIds, bytes32 userId) public payable {
        require(msg.value > 0, "Must send ETH");
        require(productIds.length > 0, "Must include at least one product");


        transactions.push(Transaction({
            orderId: orderId,
            productIds: productIds,
            userId: userId,
            sender: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit TransactionLogged(orderId, productIds,userId, msg.sender, msg.value, block.timestamp);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 index) public view returns (bytes32, bytes32[] memory, bytes32, address, uint256, uint256) {
        Transaction memory txLog = transactions[index];
        return (txLog.orderId, txLog.productIds, txLog.userId, txLog.sender, txLog.amount, txLog.timestamp);
    }

    function hasPurchasedProduct(bytes32 userId, bytes32 productId) public view returns (bool) {
        for (uint256 i = 0; i < transactions.length; i++) {
             // Bỏ qua giao dịch cũ không có userId hoặc productIds
            if (transactions[i].userId == bytes32(0)) continue;
            if (transactions[i].productIds.length == 0) continue;

            if (transactions[i].userId == userId) {
                bytes32[] memory prods = transactions[i].productIds;
                for (uint256 j = 0; j < prods.length; j++) {
                    if (prods[j] == productId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}