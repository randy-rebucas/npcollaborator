"use server";

import Event, { EventType, IEvent } from "@/models/Event";
import connect from "@/lib/db";
import { handleAsync } from '@/lib/errorHandler';
import { DatabaseError, NotFoundError, ValidationError } from '@/lib/errors';
import { logtoFetch } from "@/utils/logto-fetch";

export async function createEvent(event: Omit<IEvent, "createdAt">) {
  if (!event) {
    throw new ValidationError('Event data is required');
  }

  const [result, error] = await handleAsync(
    (async () => {
      await connect();
      return await Event.create(event);
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to create event: ${error.message}`);
  }

  return result;
}

interface GetEventsParams {
  page: number;
  search?: string;
  type?: string;
  limit?: number;
}

export interface EventDocument {
  _id: string; // We'll cast this to string anyway
  user: string;
  email: string;
  type: EventType;
  createdAt: Date;
}

export interface IEventDocument {
  tenantId: string; // We'll cast this to string anyway
  id: string;
  key: string;
  payload: {
    key: string;
    result: string;
    error: object;
    ip: string;
    userAgent: string;
    userId: string;
    applicationId: string;
    sessionId: string;
    params: object;
  };
  createdAt: Date;
}

interface GetEventsResponse {
  events: {
    id: string;
    user: string;
    ip: string;
    type: string;
    createdAt: Date;
  }[];
  total: number;
}

export async function getEvents({
  page = 1,
  limit = 10,
}: GetEventsParams): Promise<GetEventsResponse> {
  if (page < 1 || limit < 1) {
    throw new ValidationError('Invalid pagination parameters');
  }

  const [result, error] = await handleAsync(
    (async () => {
      const data = await logtoFetch(`logs?page=${page}&page_size=${limit}`);

      return {
        events: (data as unknown as IEventDocument[]).map((event) => ({
          id: event.id,
          user: event.payload.userId,
          ip: event.payload.ip,
          type: event.key,
          createdAt: event.createdAt,
        })),
        total: data.total,
      };
    })()
  );

  if (error) {
    throw new DatabaseError(`Failed to fetch events: ${error.message}`);
  }

  if (!result) {
    throw new NotFoundError('No events found');
  }

  return result as GetEventsResponse;
}
