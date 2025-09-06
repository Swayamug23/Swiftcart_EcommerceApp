import { NextResponse } from "next/server";
import connectDb from "@/utils/connectDb";
import User from "@/models/User";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const PUT = async (request) => {
  try {
    await connectDb();

    const formData = await request.formData();
    const email = formData.get("email");
    const avatarFile = formData.get("avatar");

    if (!email || !avatarFile) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }


    const buffer = Buffer.from(await avatarFile.arrayBuffer());
    const filename = `${Date.now()}_${avatarFile.name}`;
    const dirPath = path.join(process.cwd(), "public", "avatars");
    const filePath = path.join(dirPath, filename);


    await mkdir(dirPath, { recursive: true });

    await writeFile(filePath, buffer);

    const avatarUrl = `/avatars/${filename}`;


    const updatedUser = await User.findOneAndUpdate(
      { email },
      { avatar: avatarUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
};
