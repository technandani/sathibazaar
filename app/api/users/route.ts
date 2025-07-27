import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { IUser } from "@/types";

export async function GET() {
  try {
    await connectToDatabase();
    // const token = cookies().get("token")?.value;
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const { role } = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    // if (role !== "admin") {
    //   return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    // }

    const users = await User.find().select("-password -otp -otpExpires");
    return NextResponse.json(
      users.map((user: IUser) => ({
        id: user._id.toString(),
        name: user.fullName || user.businessName || "N/A",
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        status: user.isVerified ? "Active" : "Inactive",
        verification: user.isVerified ? "Verified" : "Unverified",
        lastLogin: user.updatedAt.toISOString().split("T")[0],
      }))
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectToDatabase();
    // const token = cookies().get("token")?.value;
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const { role } = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    // if (role !== "admin") {
    //   return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    // }

    const { id, name, email, role: newRole, status, verification } = await request.json();
    const user = await User.findById(id) as IUser | null;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.fullName = name;
    user.email = email;
    user.role = newRole.toLowerCase();
    user.isVerified = verification === "Verified";
    await user.save();

    return NextResponse.json({ message: "User updated" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    // const token = cookies().get("token")?.value;
    // if (!token) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // const { role } = jwt.verify(token, process.env.JWT_SECRET as string) as { role: string };
    // if (role !== "admin") {
    //   return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
    // }

    const { id } = await request.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}