import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { IUser } from "@/types";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { userId, otp } = await request.json();

    const user = await User.findById(userId) as IUser | null;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.otp !== otp || (user.otpExpires && user.otpExpires < new Date())) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
    });

    return NextResponse.json({
      message: "Verification successful",
      user: { id: user._id, role: user.role, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}