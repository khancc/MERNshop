// contracts/ReviewLogger.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ReviewLogger {
    struct Review {
        bytes32 productIdHash;
        address reviewer;
        string ipfsHash;
        uint256 timestamp;
    }

    Review[] public reviews;

    function logReview(bytes32 productIdHash, string memory ipfsHash) external {
        reviews.push(Review({
            productIdHash: productIdHash,
            reviewer: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp
        }));
    }

    function getReview(uint256 index) public view returns (bytes32, address, string memory, uint256) {
        Review memory r = reviews[index];
        return (r.productIdHash, r.reviewer, r.ipfsHash, r.timestamp);
    }

    function getReviewCount() public view returns (uint256) {
        return reviews.length;
    }
}
