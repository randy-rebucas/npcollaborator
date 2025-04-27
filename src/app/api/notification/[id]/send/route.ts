import { NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";
import NotificationSetting from "@/models/NotificationSetting";
// import { EmailService } from "@/lib/email";
import { FlattenMaps } from "mongoose";
// import EmailNotification from "@/app/models/EmailNotification";

interface NotificationUser {
  _id: unknown;
  __v: number;
  emailNotifications: boolean;
  user: {
    email: string;
  };
}

interface EmailTarget {
  emailNotifications: boolean;
  user: {
    email: string;
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const { emailOption, selectedEmails } = await request.json();
    const { claims, isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let targetsToNotify: EmailTarget[] = [];

    if (emailOption === "all") {
      const users = await NotificationSetting.find({
        user: { $ne: claims?.id },
      })
        .populate("user")
        .lean();

      if (!users || users.length === 0) {
        return NextResponse.json({
          success: false,
          message: "No users found to notify",
        });
      }
      targetsToNotify = users as FlattenMaps<NotificationUser>[];
    } else if (emailOption === "selected") {
      if (!Array.isArray(selectedEmails)) {
        // Handle comma-separated string of emails
        const emailArray = selectedEmails.split(",").map((email: string) => email.trim());
        targetsToNotify = emailArray.map((email: string) => ({
          emailNotifications: true,
          user: { email },
        }));
      } else {
        targetsToNotify = selectedEmails.map((email: string) => ({
          emailNotifications: true,
          user: { email },
        }));
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Invalid email option",
      });
    }

    await sendEmail(targetsToNotify, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

const sendEmail = async (targetUsers: EmailTarget[], id: string) => {
  console.log(targetUsers, id);
  // const emailService = new EmailService();
  // const notification = await EmailNotification.findById(id);

  // if (!notification) {
  //   throw new Error("Notification template not found");
  // }

  // for (const target of targetUsers) {
  //   try {
  //     if (target.emailNotifications) {
  //       await emailService.sendEmail({
  //         to: { email: target.user.email },
  //         subject: notification.title,
  //         htmlContent: notification.message,
  //         sender: {
  //           name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
  //           email:
  //             process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
  //         },
  //         replyTo: {
  //           name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
  //           email:
  //             process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
  //         },
  //       });
  //     }
  //   } catch (error) {
  //     console.error(`Failed to send email to ${target.user.email}:`, error);
  //   }
  // }
};
