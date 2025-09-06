// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import Product from "@/models/Products";
import connectDb from "@/utils/connectDb";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function GET(req, { params }) {
  await connectDb();
  const product = await Product.findById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function DELETE(req, { params }) {
  await connectDb();
  const { id } = params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}



export async function PUT(req, { params }) {
  await connectDb();
  const { id } = await params;
  const formData = await req.formData();

  // Get fields
  const title = formData.get("title");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const content = formData.get("content");
  const category = formData.get("category");
  const inStock = Number(formData.get("inStock"));

  // Handle images
  const images = formData.getAll("images");
  const existingImages = formData.getAll("existingImages"); // URLs of already uploaded images

  // Save new images
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const imageUrls = [...existingImages];
  for (const file of images) {
    if (typeof file === "string") continue; // skip if not a File
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrls.push(`/uploads/${filename}`);
  }

  // Update product
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        content,
        category,
        inStock,
        image: imageUrls,
      },
      { new: true }
    );
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}