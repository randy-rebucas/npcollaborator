import mongoose from "mongoose";

export enum EventType {
  ALL = 'all',
  LOGGED_IN = 'logged-in',
  MEMBER_UPDATED = 'member-updated',
  MEMBER_CREATED = 'member-created',
  MEMBER_DELETED = 'member-deleted',
  MEMBER_SYNCED = 'member-synced',
  USER_SYNCED = 'user-synced'
}

export interface IEvent {
  user: string;
  email: string;
  type: EventType;
  createdAt: Date;
}

const eventSchema = new mongoose.Schema<IEvent>({
  user: { type: String, required: true },
  email: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: Object.values(EventType)
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema); 