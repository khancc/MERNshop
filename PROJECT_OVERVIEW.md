# MERN Shop Project Overview

MERN Shop là một dự án thương mại điện tử chia thành 3 phần chính: giao diện người dùng, bảng quản trị, và backend API. Dự án dùng MongoDB, Express, React, Node.js, đồng thời có tích hợp thêm MetaMask, ethers.js, IPFS/Pinata, và một lớp smart contract để ghi nhận giao dịch và review.

## 1. Mục tiêu của dự án

Dự án mô phỏng một cửa hàng online có đầy đủ các luồng cơ bản:

- Xem danh sách sản phẩm theo danh mục.
- Xem chi tiết sản phẩm và đánh giá.
- Thêm sản phẩm vào giỏ hàng, đặt hàng và theo dõi trạng thái đơn.
- Đăng ký, đăng nhập, lưu phiên người dùng bằng JWT.
- Quản trị sản phẩm, đơn hàng, review và cấu hình ví nhận tiền.
- Ghi một phần dữ liệu mua hàng và review lên blockchain/IPFS.

## 2. Cấu trúc tổng quan

### `frontend/`
Đây là ứng dụng React dành cho khách mua hàng. Người dùng có thể duyệt sản phẩm, xem chi tiết, thêm vào giỏ, đặt hàng, kết nối MetaMask và gửi thanh toán qua contract.

### `admin/`
Đây là giao diện quản trị riêng. Admin có thể thêm/xóa sản phẩm, xem và cập nhật trạng thái đơn hàng, xem review, và quản lý địa chỉ ví nhận tiền.

### `backend/`
Đây là Express API kết nối MongoDB. Backend chịu trách nhiệm xác thực người dùng, quản lý sản phẩm, giỏ hàng, đơn hàng, review và địa chỉ ví admin.

### `contracts/`
Chứa smart contract Solidity và cấu hình Hardhat. Phần này hỗ trợ ghi giao dịch mua hàng và review lên blockchain. Frontend đọc `deployedAddresses.json` để biết địa chỉ contract đã deploy.

## 3. Luồng người dùng chính

### 3.1 Trang chủ và danh mục sản phẩm

Trang chính của frontend lấy danh sách sản phẩm từ API `/api/product/list`. Người dùng có thể:

- xem hero/banner,
- lọc sản phẩm theo danh mục,
- mở trang chi tiết từng sản phẩm.

Hiển thị sản phẩm được quản lý bởi `ShopContext`, nơi dữ liệu sản phẩm được nạp ngay khi app khởi chạy.

### 3.2 Đăng ký và đăng nhập

Popup đăng nhập/đăng ký gửi request tới:

- `/api/user/login`
- `/api/user/register`

Khi đăng nhập thành công, frontend lưu JWT vào `localStorage` và giữ token trong context để dùng cho các request cần xác thực.

### 3.3 Giỏ hàng

Giỏ hàng được lưu hai lớp:

- trên frontend để phản hồi UI nhanh,
- trên backend trong field `cartData` của user.

Các API chính là:

- `POST /api/cart/add`
- `POST /api/cart/remove`
- `POST /api/cart/get`

Trang cart tính subtotal, phí ship cố định, và tổng tiền để chuyển sang bước checkout.

### 3.4 Checkout và đặt hàng

Người dùng sang trang checkout với dữ liệu đơn hàng đã được chuẩn bị trước. Backend tạo order qua `POST /api/order/placeorder` và lưu:

- `userId`
- `items`
- `amount`
- `address`
- `payment`

Sau khi đặt hàng, frontend chuyển sang trang thành công để tiếp tục xử lý thanh toán bằng MetaMask và contract.

### 3.5 Thanh toán bằng MetaMask và contract

Sau khi đặt hàng, frontend gọi `sendEthViaContract()` từ `frontend/src/utils/contract.js`. Hàm này:

- lấy `window.ethereum`,
- tạo `ethers.BrowserProvider`,
- chuyển số tiền USD sang ETH theo tỉ giá hardcode,
- gọi contract `logTransaction(...)`.

Luồng này không chỉ chuyển tiền mà còn ghi log giao dịch lên smart contract bằng `orderId`, danh sách sản phẩm và `userId` đã băm bằng `ethers.id()`.

### 3.6 Theo dõi đơn hàng

Người dùng có thể mở trang “My Orders” để xem các đơn của mình thông qua `POST /api/order/userorders`. Admin có trang riêng để xem tất cả đơn qua `GET /api/order/list` và cập nhật trạng thái đơn bằng `POST /api/order/status`.

## 4. Chức năng review và IPFS

Phần review là điểm khác biệt lớn nhất của dự án.

### 4.1 Người dùng tạo review

Trong trang sản phẩm, `ReviewSection` cho phép người dùng:

- chọn số sao,
- nhập nội dung review,
- đính kèm ảnh,
- upload dữ liệu lên Pinata/IPFS.

File `frontend/src/utils/ipfs.js` làm 2 việc:

- upload từng ảnh lên Pinata,
- gom metadata review thành JSON rồi lưu tiếp lên IPFS.

Kết quả cuối cùng là một `ipfsHash`.

### 4.2 Lưu review ở backend

Sau khi có `ipfsHash`, frontend gọi:

- `POST /api/product/reviews`

Backend lưu vào MongoDB một bản ghi rất gọn gồm:

- `productId`
- `ipfsHash`
- `createdAt`

Điều đó có nghĩa là nội dung review thật nằm trên IPFS, còn database chỉ giữ chỉ mục để tra cứu.

### 4.3 Xem review ở frontend và admin

Khi hiển thị review, frontend và admin đều lấy danh sách review từ backend rồi dùng `ipfsHash` để tải JSON từ gateway của Pinata. Dữ liệu IPFS thường chứa:

- `rating`
- `content`
- `user`
- `timestamp`
- `images`

Trang chi tiết sản phẩm cũng tính điểm trung bình từ các review này.

### 4.4 Ghi review lên blockchain

Code trong `frontend/src/utils/reviewlogger.js` và một phần comment trong `ReviewSection` cho thấy dự án từng hướng tới việc log review lên contract `ReviewLogger`. Hiện tại luồng chính đang ưu tiên IPFS + MongoDB, còn phần ghi review on-chain là nhánh có sẵn nhưng chưa được bật hoàn toàn.

## 5. Backend làm gì

### 5.1 Xác thực người dùng

Backend dùng JWT. Middleware `auth.js` đọc token từ header `token`, verify bằng `JWT_SECRET`, rồi gắn `req.user.userId` cho các route cần đăng nhập.

### 5.2 Sản phẩm

API sản phẩm hỗ trợ:

- thêm sản phẩm kèm ảnh upload bằng `multer`,
- lấy toàn bộ danh sách sản phẩm,
- xóa sản phẩm.

Ảnh được lưu trong thư mục `backend/uploads/` và được phục vụ qua `/images`.

### 5.3 Người dùng

Backend hỗ trợ:

- đăng ký,
- đăng nhập,
- lấy profile hiện tại.

Profile hiện tại chỉ trả về `name` và `email`.

### 5.4 Giỏ hàng

Backend lưu giỏ hàng trong `cartData` của user, là một object map giữa `productId` và số lượng.

### 5.5 Đơn hàng

Order model lưu địa chỉ giao hàng, danh sách items, tổng tiền, trạng thái và trạng thái thanh toán. Mặc định đơn có status là `Product Loading` và `payment` là `false`.

### 5.6 Cấu hình ví admin

Route `/api/admin/wallet` cho phép:

- lấy địa chỉ ví mới nhất,
- cập nhật địa chỉ ví nhận tiền.

Admin wallet page còn đọc số dư thực của địa chỉ đó bằng ethers.js.

## 6. Bảng quản trị làm gì

### 6.1 Thêm sản phẩm

Trang Add cho phép admin nhập tên, mô tả, giá, danh mục và upload ảnh.

### 6.2 Danh sách sản phẩm

Trang List lấy toàn bộ sản phẩm và cho phép xóa sản phẩm khỏi MongoDB, đồng thời xóa file ảnh trên server.

### 6.3 Quản lý đơn hàng

Trang Orders hiển thị toàn bộ đơn, thông tin khách, các item trong đơn, tổng tiền và dropdown đổi trạng thái giữa:

- `Product Loading`
- `Out for delivery`
- `Delivered`

### 6.4 Quản lý review

Trang Reviews tải toàn bộ review từ backend, sau đó fetch metadata từ IPFS/Pinata để hiển thị nội dung, rating và ảnh đính kèm.

### 6.5 Quản lý ví

Trang Wallet cho phép xem và cập nhật địa chỉ ví admin, đồng thời đọc số dư ETH thực tế của địa chỉ đó.

## 7. Smart contract và blockchain

Thư mục `contracts/` là một Hardhat project riêng, có:

- source contract Solidity,
- script deploy,
- ignition module,
- file địa chỉ deploy `deployedAddresses.json`.

Frontend sử dụng contract address này để:

- ghi log giao dịch mua hàng,
- kiểm tra mua hàng đã từng xảy ra hay chưa,
- lưu hoặc đọc một phần dữ liệu review trên chain trong nhánh code chuẩn bị sẵn.

Nói ngắn gọn: blockchain ở đây không thay thế hoàn toàn database, mà đóng vai trò lớp ghi nhận bổ sung cho thanh toán và review.

## 8. Những điểm cần lưu ý khi đọc dự án

- Trang `Verify` trong frontend vẫn đang gọi endpoint `/api/order/verify`, nhưng route này chưa được đăng ký trong `backend/routes/orderRoute.js`.
- Một số luồng review on-chain được giữ lại dưới dạng comment hoặc helper riêng, nhưng luồng đang chạy chính là IPFS + MongoDB.
- `frontend/src/utils/ipfs.js` đang chứa khóa Pinata hardcode, nên về mặt an toàn đây là phần nên chuyển sang biến môi trường.
- Trang Wallet ở admin hiện có dữ liệu giao dịch mẫu giả lập, không phải lịch sử giao dịch thật từ blockchain.

## 9. Tóm tắt ngắn

Đây là một project e-commerce có đủ lớp người dùng, admin, backend, và blockchain. Người dùng duyệt sản phẩm, thêm giỏ, đặt hàng, thanh toán bằng MetaMask, và viết review có ảnh. Admin quản lý sản phẩm, đơn hàng, review và ví nhận tiền. Dữ liệu được lưu hỗn hợp giữa MongoDB, IPFS và smart contract để mô phỏng một hệ thống bán hàng có yếu tố web3.