import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import Order from "@/models/Order";
import Product from "@/models/Products";
import User from "@/models/User";

export async function POST(req) {
  await connectDb();
  const orderinfo = await req.json();

  console.log("orderinfo" , orderinfo);
  

  const { email, total, address, mobile, cart, delivered, PaymentID } = orderinfo;

  let user = null;
  if (email) {
    user = await User.findOne({ email });
  }

  try {
    const order = await Order.create({
      user: user ? user._id : undefined,
      total,
      address,
      mobile,
      cart,
      delivered: delivered ?? false,
      PaymentID
    });

    for (const item of cart) {
      await Product.findByIdAndUpdate(item._id, {
        $inc: {
          inStock: -item.quantity,
          sold: +item.quantity
        },
        new: true
      });
    }


    return NextResponse.json({ success: true, order });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}