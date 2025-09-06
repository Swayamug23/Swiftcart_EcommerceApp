
import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/User";
import valid from "@/utils/valid";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  await connectDb();
  const { email,name } = await req.json();

 
  await User.findOneAndUpdate({ email }, { name:name});

  return NextResponse.json({ success: true });
}