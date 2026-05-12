import mongoose from "mongoose";

const WalletSettingSchema = new mongoose.Schema({
   address: {
    type: String,
    required: true,
  },
});
const adminWallet = mongoose.model("WalletSetting", WalletSettingSchema);
export default adminWallet;
