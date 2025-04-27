import UserProfile from "@/models/UserProfile";
import connect from "@/lib/db";
import { NextResponse } from "next/server";
import { logtoConfig } from "@/app/logto";
import { getLogtoContext } from "@logto/next/server-actions";

export async function POST(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    const { profilePhotoPath } = await request.json();

    const userProfile = await UserProfile.findOne({ user: claims?.id });
    userProfile.profilePhotoPath = profilePhotoPath;
    await userProfile.save();

    return NextResponse.json(
      { message: "Avatar uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
