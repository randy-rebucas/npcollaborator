import { sdk } from "@/config/sharetribe";
import { generatePassword } from "@/lib/utils";
import { createEvent } from "@/app/actions/events";
import { EventType } from "@/models/Event";
import { getUser, updateUserCustomData } from "@/app/actions/user";
import { EmailService } from "@/lib/email";
import Template from "@/models/Template";

export async function POST(request: Request) {
  try {

    const { id } = await request.json();

    const user = await getUser(id);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    /**
     * Create the payload for the user
     */
    const sharetribePayload = {
      email: user.primaryEmail,
      password: generatePassword(),
      firstName: user.profile?.familyName || '',
      lastName: user.profile?.givenName || '',
      displayName: user.username,
      protectedData: {},
      publicData: {},
    };
    /**
     * Sync the user to Sharetribe
     */
    const sharetribeUser = await sdk.currentUser.create(sharetribePayload);

    if (!sharetribeUser) {
      return Response.json(
        { error: "Failed to create Sharetribe user" },
        { status: 500 }
      );
    }

    /**
     * Update the member accountSynced to true
     */
    await updateUserCustomData(id, {
      accountSynced: true,
    });

    // Create an event
    await createEvent({
      user: user.id || '',
      email: user.primaryEmail || '',
      type: EventType.USER_SYNCED,
    });

    // Get the default template for account synced
    let template = await Template.findOne({ isDefault: true, type: "email", code: "account-synced" });
    if (!template) {
      template = await Template.findOne({ type: "email", code: "account-synced" });
    }

    const emailService = new EmailService();
    await emailService.sendEmail({
      to: [{ email: user.primaryEmail || "" }], 
      subject: template?.name || "Account Synced",
      htmlContent: template?.content || "<p>Your account has been synced to Sharetribe</p>",
      sender: {
        name: process.env.NEXT_PUBLIC_APP_NAME || "npcollaborator",
        email: process.env.NEXT_PUBLIC_APP_EMAIL || "noreply@npcollaborator.com",
      },
    });

    return Response.json({ success: true, user: sharetribeUser });

  } catch (error) {
    console.error("Error syncing user to Sharetribe:", error); 
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
