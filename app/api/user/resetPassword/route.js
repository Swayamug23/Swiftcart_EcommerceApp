import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/User";
import valid from "@/utils/valid";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  await connectDb();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const validationMsg = valid("", email, password);
  if (validationMsg !== true) {
    return NextResponse.json({ error: validationMsg }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  return NextResponse.json({ success: true });
}