import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();
    const userDoc = await User.findOne({ email });

    if (!userDoc) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await userDoc.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!userDoc.isVerified) {
      return NextResponse.json({ message: "Account not verified" }, { status: 403 });
    }

    const token = jwt.sign(
      { id: userDoc._id, role: userDoc.role, email: userDoc.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    cookies().set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json({
      message: "Login successful",
      user: { id: userDoc._id, role: userDoc.role, email: userDoc.email, fullName: userDoc.fullName },
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: (err as Error).message },
      { status: 500 }
    );
  }
}
