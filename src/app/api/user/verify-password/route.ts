import { NextResponse } from "next/server";
import User from "@/models/User";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function POST(request: Request) {
  try {
    await connect();
    const { claims } = await getLogtoContext(logtoConfig);
    const { password } = await request.json();
    const user = await User.findOne({ email: claims?.email });
    const isMatch = await user.comparePassword(password);
    return NextResponse.json({ isMatch });
  } catch (error) {
    console.error("Error in verify-password:", error);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
}
