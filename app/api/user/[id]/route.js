// fetch user
import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/User";   

export async function GET(req, { params }) {
    await connectDb()
    let u = await User.findById(params.id)
    if (!u) return NextResponse.json({ error: "User not found" });
    return NextResponse.json({ user: u });
}

export async function DELETE(req, { params }) {
    await connectDb()
    let user = await User.findByIdAndDelete(params.id)
    if (!user) return NextResponse.json({ error: "User not found" });
    return NextResponse.json({ message: "User deleted successfully" });
}

export async function UPDATE(req, { params }) {
    await connectDb()
    let user = await User.findById(params.id)
    if (!user) return NextResponse.json({ error: "User not found" });
    user.role = 'admin'
    await user.save()
    return NextResponse.json({ message: "User is now an admin" });
}