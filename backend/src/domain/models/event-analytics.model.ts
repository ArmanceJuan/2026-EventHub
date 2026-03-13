import mongoose, { InferSchemaType } from "mongoose";

export type EventType = "pageview" | "buy-ticket" | "event-view" | "click";

export const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      enum: ["pageview", "buy-ticket", "event-view", "click"],
      lowercase: true,
      maxLength: 255,
    },
    userId: String,
    page: String,
    timestamp: Date,
  },
  {
    timestamps: true,
  },
);

export type Event = InferSchemaType<typeof EventSchema>;

export const EventModel = mongoose.model<Event>("Event", EventSchema);
