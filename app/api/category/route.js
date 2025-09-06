import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import Category from "@/models/Category";

export async function POST(req) {
  await connectDb();
  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Category name required" }, { status: 400 });
  }
  try {
    const category = await Category.create({ name: name.trim() });
    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  await connectDb();
  const categories = await Category.find().sort({ createdAt: -1 });
  return NextResponse.json({ categories });
}

export async function PUT(req) {
  await connectDb();
  const { id, name } = await req.json();
  if (!id || !name || !name.trim()) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  try {
    const category = await Category.findByIdAndUpdate(id, { name: name.trim() }, { new: true });
    return NextResponse.json({ success: true, category });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  await connectDb();
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }
  try {
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}