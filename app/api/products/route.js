import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import Product from "@/models/Products";
import connectDb from "@/utils/connectDb";
import Category from "@/models/Category";

// get all products
export async function GET(req) {
  await connectDb();

  try {
    const { searchParams } = new URL(req.url);
    console.log(searchParams)

    // Check if requesting categories
    
    // Otherwise return products
    const catId = searchParams.get("category") || "";
    let category;
    if(catId){
        category = await Category.findById(catId)|| "";
    }
    
    const q = searchParams.get("q") || "";
    const sort = searchParams.get("sort") || "newest";

    let filter = {};

    // Category filter
    if (category) {
      filter.category = category.name;
    }

    // Text search (title, description, content)
    if (q) {
      filter.$or = [
        { title: { $regex: `^${q}`, $options: "i" } },

      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "bestselling") sortOption = { sold: -1 };
    if (sort === "price_low") sortOption = { price: 1 };
    if (sort === "price_high") sortOption = { price: -1 };

    console.log(filter);
    

    const products = await Product.find(filter).sort(sortOption);

    return new Response(JSON.stringify({ success: true, products }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to fetch" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await connectDb();

  // Parse FormData
  const formData = await req.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const content = formData.get("content");
  const category = formData.get("category");
  const inStock = Number(formData.get("inStock"));

  // Validate required fields
  if (!title || !description || !price || !content || !category || isNaN(inStock)) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  // Handle images
  const images = formData.getAll("images");
  if (images.length === 0 || images.length > 5) {
    return NextResponse.json({ error: "Please upload 1-5 images." }, { status: 400 });
  }

  // Ensure uploads directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Save images and collect URLs
  const imageUrls = [];
  for (const file of images) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrls.push(`/uploads/${filename}`);
  }

  
  try {
    const product = await Product.create({
      title,
      description,
      price,
      content,
      category,
      inStock,
      image: imageUrls,
    });
    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}