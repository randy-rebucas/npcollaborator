import { NextResponse } from "next/server";
import NotificationSetting from "@/models/NotificationSetting";
import connect from "@/lib/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

export async function PATCH(request: Request) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, value } = await request.json();

    await connect();

    const settings = await NotificationSetting.updateOne(
      { user: claims?.id },
      {
        $set: {
          [`notificationTypes.${type}`]: value,
        },
      }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update notification type" },
      { status: 500 }
    );
  }
}
