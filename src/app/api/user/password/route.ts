import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";


export async function PUT(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ email: claims?.email });
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
    }
    user.password = newPassword;
    await user.save();
    
    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update password" },
      { status: 500 }
    );
  }
}
