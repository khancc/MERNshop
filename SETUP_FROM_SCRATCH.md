# Setup From Scratch

Tài liệu này hướng dẫn chạy dự án MERN Shop từ đầu trên một máy mới, dựa trên đúng cấu trúc và script hiện có trong workspace.

## 1. Chuẩn bị

Cần có:

- Node.js 18+.
- npm đi kèm Node.
- Một trong hai lựa chọn cho database:
	- MongoDB Atlas, không cần tải MongoDB về máy.
	- MongoDB local, nếu muốn chạy cơ sở dữ liệu ngay trên máy.
- MetaMask nếu muốn test phần thanh toán web3.
- Git để clone repo.

## 2. Clone project

```bash
git clone <repo-url>
cd MERNshop
```

Nếu bạn đang đứng ngay trong workspace hiện tại thì không cần clone lại.

## 3. Cài dependencies cho từng phần

Dự án không dùng một package.json chung cho toàn bộ app, nên cài riêng trong từng thư mục.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Admin

```bash
cd admin
npm install
```

### Contracts

```bash
cd contracts
npm install
```

## 4. Cấu hình môi trường

### Backend `.env`

Backend hiện đang dùng file `.env` trong thư mục `backend/` với ít nhất các biến sau:

- `JWT_SECRET`
- `STRIPE_SECRET_KEY`

Nếu bạn tự chạy trên máy riêng, hãy tạo hoặc cập nhật `backend/.env` tương ứng. Không nên commit secret thật lên git.

### MongoDB

MongoDB Atlas không cần cài database xuống máy. Bạn chỉ cần:

1. Tạo tài khoản Atlas.
2. Tạo cluster.
3. Tạo database user và lấy connection string.
4. Dán connection string đó vào backend.

Hiện tại backend đang kết nối MongoDB bằng URI hardcode trong [backend/config/db.js](backend/config/db.js). Có 2 cách chạy:

- Dùng luôn URI hiện có trong repo nếu chỉ muốn test nhanh đúng theo bản hiện tại.
- Đổi sang URI Atlas riêng của bạn hoặc URI MongoDB local của bạn nếu muốn chạy trên máy khác.

Nếu dùng MongoDB local, bạn phải cài MongoDB server trên máy và thay URI trong `connectDB()` thành chuỗi local của bạn.

### Smart contract addresses

Frontend blockchain đang đọc địa chỉ contract từ [contracts/deployedAddresses.json](contracts/deployedAddresses.json). File này phải chứa đúng địa chỉ đã deploy cho:

- `TransactionLogger`
- `ReviewLogger`

Nếu bạn deploy contract mới, cần cập nhật lại file này để frontend gọi đúng địa chỉ.

### Pinata / IPFS

Phần review upload ảnh và JSON lên Pinata đang dùng key hardcode trong [frontend/src/utils/ipfs.js](frontend/src/utils/ipfs.js). Muốn chạy ổn định, bạn cần:

- giữ nguyên key hiện có nếu chỉ test nhanh trong môi trường hiện tại,
- hoặc thay bằng key của bạn nếu deploy lại.

## 5. Chạy từng service

Thứ tự hợp lý là backend trước, rồi frontend, admin, và contracts nếu cần.

### 5.1 Backend

Trong thư mục `backend/`:

```bash
npm start
```

Hoặc chạy dev mode với nodemon:

```bash
npm run server
```

Backend mặc định chạy ở `http://localhost:4000`.

Nếu backend báo lỗi kết nối database, gần như chắc chắn là do URI MongoDB trong [backend/config/db.js](backend/config/db.js) chưa đúng hoặc chưa cho phép IP truy cập ở Atlas.

### 5.2 Frontend

Trong thư mục `frontend/`:

```bash
npm run dev
```

Frontend Vite thường chạy ở `http://localhost:5173`.

### 5.3 Admin

Trong thư mục `admin/`:

```bash
npm run dev
```

Admin Vite thường chạy ở `http://localhost:5174` hoặc port được Vite chọn.

### 5.4 Contracts

Trong thư mục `contracts/`:

```bash
npx hardhat compile
```

Nếu cần test hoặc deploy lại:

```bash
npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## 6. Luồng chạy đầy đủ

1. Bật backend.
2. Bật frontend.
3. Bật admin nếu cần quản trị.
4. Đăng ký hoặc đăng nhập user.
5. Thêm sản phẩm vào giỏ hàng.
6. Đi qua checkout và kết nối MetaMask nếu muốn test thanh toán web3.
7. Xác nhận đơn hàng.
8. Kiểm tra đơn trong trang My Orders hoặc trong admin.

## 7. Những điểm cần biết trước khi chạy

- Phần thanh toán web3 phụ thuộc MetaMask và contract address hợp lệ.
- Review phụ thuộc IPFS/Pinata, nên nếu key không hợp lệ thì upload review sẽ fail.
- Backend đang phụ thuộc JWT để bảo vệ các route liên quan đến user, cart và order.
- Một số route hoặc luồng phụ có thể đang ở trạng thái dở dang; ví dụ trang verify order có thể không khớp với route backend hiện tại.

## 8. Cấu trúc nhanh theo mục đích

- [frontend/](frontend/) là shop cho khách hàng.
- [admin/](admin/) là trang quản trị.
- [backend/](backend/) là API server.
- [contracts/](contracts/) là phần smart contract và deploy.

## 9. Kiểm tra nhanh nếu lỗi

- Nếu frontend không gọi được API, kiểm tra backend có đang chạy ở `localhost:4000` không.
- Nếu login lỗi, kiểm tra `JWT_SECRET` trong `backend/.env`.
- Nếu thanh toán MetaMask lỗi, kiểm tra MetaMask đã cài và đã kết nối chưa.
- Nếu review không upload được, kiểm tra Pinata keys và kết nối Internet.
- Nếu contract không gọi được, kiểm tra `contracts/deployedAddresses.json` có đúng địa chỉ hay không.

## 10. Ghi chú quan trọng

File `backend/.env` hiện có sẵn trong repo và chứa secret dùng cho local/dev. Khi tạo bản setup cho máy mới, nên thay bằng file `.env` riêng của bạn.

Nếu dùng MongoDB Atlas thì không cần tải MongoDB Server về máy, nhưng vẫn cần cấu hình đúng connection string và whitelist IP trong Atlas.
