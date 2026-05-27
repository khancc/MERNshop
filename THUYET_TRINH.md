# THUYET TRINH MERN SHOP

## 1) Tong quan
MERN Shop la mo hinh e-commerce day du gom 3 he thong (frontend cho khach, admin cho quan tri, backend API) va mo rong them blockchain + IPFS de ghi nhan giao dich va luu review co dinh kem hinh anh.

## 2) Muc tieu cua du an
- Xay dung quy trinh ban hang co ban: xem san pham, them gio, dat hang, theo doi don.
- Co quan tri noi bo: quan ly san pham, don hang, review, cau hinh vi.
- Tich hop web3: thanh toan bang MetaMask va ghi giao dich len smart contract.
- Luu du lieu review tren IPFS de dam bao tinh toan ven va giam phu thuoc vao database.

## 3) Y nghia / diem doc dao
- Ket hop web2 + web3: business logic van nam trong database, nhung giao dich va bang chung mua hang duoc ghi nhan tren blockchain.
- Review duoc luu tren IPFS: noi dung review khong bi sua doi khi da pin.
- Phu hop demo: the hien tuong tac MetaMask, giao dich on-chain, va du lieu off-chain.

## 4) Kien truc tong the
- Frontend: UI mua hang, gio hang, checkout, thanh toan MetaMask.
- Admin: quan tri san pham, don hang, review, vi nhan tien.
- Backend: API, auth JWT, luu tru MongoDB, xu ly order/review.
- Contracts: log giao dich va (tu chon) log review on-chain.
- IPFS/Pinata: luu noi dung review va hinh anh.

## 5) Luong chuc nang chinh
1. Khach xem san pham -> them gio -> checkout.
2. Backend tao don hang va luu vao MongoDB.
3. Frontend goi smart contract de gui ETH va log giao dich.
4. Admin xem danh sach don, cap nhat trang thai.
5. Khach gui review + anh, review duoc pin len IPFS; backend luu ipfsHash.
6. Frontend/Admin lay ipfsHash de hien thi noi dung review.

## 6) Vai tro blockchain va IPFS
- Blockchain: ghi nhan giao dich (orderId, productIds, userId) va ho tro xac thuc "da mua".
- IPFS: luu review va anh, backend chi luu hash de tra ve khi can hien thi.

## 7) Demo de thuyet trinh (goi y 3-5 phut)
- Dang nhap -> them san pham -> checkout -> MetaMask xac nhan giao dich.
- Mo Admin -> xem don moi -> doi trang thai.
- Vao lai san pham -> viet review + anh -> Admin xem review.

## 8) Han che hien tai
- Review on-chain chua bat day du (dang uu tien IPFS + MongoDB).
- Ty gia USD/ETH dang hardcode (chi demo).
- Neu restart blockchain local thi can deploy lai contract.

## 9) Huong phat trien
- Deploy len testnet de demo multi-user that.
- Luu review on-chain de minh bach hoan toan.
- Tich hop thanh toan on-chain theo ty gia real-time.

## 10) Thong diep chinh khi thuyet trinh
Du an the hien mo hinh e-commerce co kha nang mo rong sang web3: giao dich minh bach tren blockchain va du lieu review ben vung tren IPFS, trong khi he thong web2 van dam nhiem nghiep vu chinh.
