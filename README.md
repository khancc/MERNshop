# MERN Shop

Dự án **MERN Shop** là một ứng dụng thương mại điện tử gồm 3 phần chính: frontend (khách hàng), admin (quản trị), backend (API). Ngoài ra dự án có tích hợp blockchain (smart contract) và IPFS cho luồng thanh toán + review.

## Cấu trúc thư mục
- `admin/` : giao diện quản trị
- `backend/` : API server (Express + MongoDB)
- `contracts/` : smart contract (Solidity + Hardhat)
- `frontend/` : giao diện người dùng (React)

## Yêu cầu hệ thống
- Node.js >= 18
- MongoDB (Atlas hoặc local)
- MetaMask (để demo thanh toán web3)
- Pinata API key (để upload review lên IPFS)

## Cài đặt dependencies (mỗi thư mục một lần)

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install

cd ../contracts
npm install
```

## Cấu hình bắt buộc

### 1) MongoDB
- Sửa URI trong `backend/config/db.js` bằng MongoDB Atlas hoặc local của bạn.
- Nếu dùng Atlas, nhớ whitelist IP và dùng đúng user/password.

### 2) JWT_SECRET (backend)
Backend cần biến môi trường `JWT_SECRET` để ký token.

PowerShell (Windows):
```powershell
$env:JWT_SECRET="dev-secret-1234567890-abcdef"
```

### 3) Pinata (IPFS)
Sửa 2 biến trong `frontend/src/utils/ipfs.js`:
- `PINATA_API_KEY`
- `PINATA_SECRET_API_KEY`

## Chạy local blockchain (Hardhat)

Mở terminal 1:
```bash
cd contracts
npx hardhat node
```

Mở terminal 2 (deploy contract):
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

Sau khi deploy, địa chỉ sẽ được ghi vào `contracts/deployedAddresses.json`.

## MetaMask (demo local)
- Add network:
   - RPC: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`
- Import 1 private key từ output của `hardhat node` để có ETH test.

## Chạy các service

### Backend
```bash
cd backend
npm run server
```

### Frontend
```bash
cd frontend
npm run dev
```

### Admin
```bash
cd admin
npm run dev
```

## Địa chỉ chạy mặc định
- Backend: http://localhost:4000
- Frontend: http://localhost:5173
- Admin: http://localhost:5174
- Hardhat RPC: http://127.0.0.1:8545

## Gợi ý demo nhanh
1. Đăng ký / đăng nhập trên frontend.
2. Thêm sản phẩm vào giỏ và checkout.
3. Kết nối MetaMask và xác nhận giao dịch.
4. Viết review kèm ảnh (upload lên IPFS).
5. Mở admin để xem đơn hàng + review.

## Công nghệ sử dụng
- MongoDB: cơ sở dữ liệu
- Express.js: backend API
- React.js + Vite: frontend/admin UI
- Node.js: runtime
- Hardhat + Solidity: smart contract
- IPFS/Pinata: lưu review
