import { revalidateTag } from "next/cache";
import connect from "@/lib/db";
import EmailNotification from "@/models/EmailNotification"; 
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';

interface GetNotificationsParams {
  page: number;
  search?: string;
  limit?: number;
}

interface NotificationQuery {
  $or?: {
    title?: { $regex: string; $options: string } | string;
  }[];
}

export interface EmailNotificationDocument {
  _id: string; // We'll cast this to string anyway
  title: string;
  message: string;
  link: string;
}

interface GetNotificationsResponse {
  notifications: EmailNotificationDocument[];
  total: number;
}

export async function getNotifications({
  page = 1,
  search = "",
  limit = 10,
}: GetNotificationsParams): Promise<GetNotificationsResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      // Build query conditions
      const query: NotificationQuery = {};

      if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }];
      }

      // Execute query with pagination
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        EmailNotification.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        EmailNotification.countDocuments(query),
      ]);

      return {
        notifications: (notifications as unknown as EmailNotificationDocument[]).map(
          (notification) => ({
            _id: notification._id.toString(),
            title: notification.title,
            message: notification.message,
            link: notification.link,
          })
        ),
        total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch notifications: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No notifications found');
  }

  return result;
}

export async function deleteNotification(id: string) {
  if (!id) {
    throw new ValidationError('Notification ID is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      const notification = await EmailNotification.findByIdAndDelete(id);
      if (!notification) {
        throw new ValidationError(`Notification with ID ${id} not found`);
      }
      revalidateTag("email-notifications"); // Update cached notifications
      return { success: true };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to delete notification: ${error.message}`);
  }

  return result;
}
