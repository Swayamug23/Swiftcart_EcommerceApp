import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDb from "@/utils/connectDb";
import valid from "@/utils/valid";
import bcrypt from "bcryptjs"; // <-- Add this import

export async function POST(req) {
  await connectDb();
  const { name, email, password } = await req.json();

  const validationMsg = valid(name, email, password);
  if (validationMsg !== true) {
    return NextResponse.json({ message: validationMsg }, { status: 400 });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user with hashed password
  const user = await User.create({ name, email, password: hashedPassword });
  return NextResponse.json({ message: "User registered", user }, { status: 201 });
}