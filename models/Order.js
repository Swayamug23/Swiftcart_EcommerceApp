import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  total: { type: Number},
  address: { type: String },
  mobile: { type: String},
  cart: { type: Array, required: true },
  delivered: { type: Boolean, default: false },
  delivereAt: { type: Date },
  PaymentID: { type: String }

}, {
    timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
