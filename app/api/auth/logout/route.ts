import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    cookies().set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0, // Immediately expire the cookie to delete it
      sameSite: "strict",
    });
    return NextResponse.json({ message: "Logout successful" });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}