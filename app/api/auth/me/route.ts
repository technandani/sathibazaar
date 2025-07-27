import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { IUser } from "@/types";

export async function GET() {
  try {
    await connectToDatabase();
    const token = cookies().get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(id).select("-password -otp -otpExpires") as IUser | null;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id,
      role: user.role,
      email: user.email,
      fullName: user.fullName,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}