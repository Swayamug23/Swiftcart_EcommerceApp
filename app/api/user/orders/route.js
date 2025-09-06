import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req) {
  await connectDb();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ orders: [] });

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ orders: [] });

  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}