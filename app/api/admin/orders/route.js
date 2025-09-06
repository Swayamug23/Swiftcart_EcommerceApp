import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import Order from "@/models/Order";

export async function GET() {
  await connectDb();
  const orders = await Order.find({}).populate("user").sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}

export async function PUT(req) {
  await connectDb();
  const { orderId } = await req.json();
  const order = await Order.findByIdAndUpdate(
    orderId,
    { delivered: true, deliveredAt: new Date() },
    { new: true }
  );
  return NextResponse.json({ success: !!order, order });
}