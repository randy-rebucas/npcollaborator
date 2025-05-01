import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function POST() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();
    
    await Notification.updateMany(
      { user: claims?.id, read: false },
      { read: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 