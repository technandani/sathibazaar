import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { role, businessName, fullName, contactPerson, email, phone, password } = await request.json();

    if (role === "admin") {
      return NextResponse.json({ message: "Admin registration not allowed" }, { status: 403 });
    }

    if (!["vendor", "supplier"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const userData: any = {
      role,
      email,
      phone,
      password,
      otp,
      otpExpires,
      isVerified: false,
    };

    // Add role-specific fields
    if (role === "vendor") {
      userData.fullName = fullName;
    } else {
      userData.businessName = businessName;
      userData.fullName = contactPerson;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"SathiBazaar" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "SathiBazaar OTP Verification",
      text: `Your OTP for account verification is ${otp}. It expires in 10 minutes.`,
    });

    return NextResponse.json({ message: "OTP sent", userId: user._id.toString() });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
