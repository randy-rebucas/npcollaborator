import { NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import connect from "@/lib/db";
import Notification from "@/models/Notification";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: claims?.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return new NextResponse("Notification not found", { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Failed to update notification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
