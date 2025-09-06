import { NextResponse } from "next/server";
import Product from "@/models/Products";
import connectDb from "@/utils/connectDb";

export async function POST(req) {
  await connectDb();
  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });
  }
  await Product.deleteMany({ _id: { $in: ids } });
  return NextResponse.json({ success: true });
}