import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/Notification";
import connect from "@/lib/db";
import NotificationSetting from "@/models/NotificationSetting";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
// import { EmailService } from "@/lib/email";

export async function GET() {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();
    console.log(claims?.id);
    const notifications = await Notification.find({
      user: claims?.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    const body = await request.json();
    console.log(body);

    // Check if the user has email notifications enabled
    const targetUser = await NotificationSetting.find({
      user: { $ne: claims?.id },
    })
      .populate("user")
      .lean();

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        message: "Target user not found",
      });
    }

    // const emailService = new EmailService(); 

    // for (const target of targetUser) {

    //   // Create in-app notification
    //   const notification = await Notification.create({
    //     ...body,
    //     user: target.user._id,
    //     type: "in-app",
    //   });

    //   // Check if the user has email notifications enabled
    //   if (target.emailNotifications) {
    //     await emailService.sendEmail({
    //       to: [{ email: target.user.email! }],
    //       subject: notification.title,
    //       htmlContent: notification.message,
    //       sender: {
    //         name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
    //         email:
    //           process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
    //       },
    //     });
    //   }
    // }
    
    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
    });
  } catch (error) {
    console.error("Error in notifications:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}
