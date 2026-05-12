import express from "express";
import WalletSettingSchema from "../models/adminWalletSetting.js";

const walletRouter = express.Router();

walletRouter.get("/", async (req, res) => {
  try {
    const latest = await WalletSettingSchema.findOne().sort({ updatedAt: -1 });
    if (!latest) return res.status(404).json({ message: "Chưa có địa chỉ ví nào" });
    res.json({ address: latest.address });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy địa chỉ ví" });
  }
});

// POST /api/admin/wallet - Cập nhật địa chỉ ví
walletRouter.put("/", async (req, res) => {
  try {
    const { address } = req.body;
    let wallet = await WalletSettingSchema.findOne();

    if (wallet) {
      wallet.address = address;
      await wallet.save();
    } else {
      wallet = await WalletSettingSchema.create({ address });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default walletRouter;