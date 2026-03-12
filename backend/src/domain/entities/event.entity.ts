export interface EventProps {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  venueId: string;
  capacity: number;
  price?: number;
  organizerId: string;
  categoryId: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Event {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly startDate: Date;
  public readonly venueId: string;
  public readonly capacity: number;
  public readonly price?: number;
  public readonly organizerId: string;
  public readonly categoryId: string;
  public readonly imageUrl?: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: EventProps) {
    if (!props.title || props.title.trim() === "")
      throw new Error("Title is required");
    if (!props.venueId || props.venueId.trim() === "")
      throw new Error("Venue is required");
    if (!(props.startDate instanceof Date) || isNaN(props.startDate.getTime()))
      throw new Error("Start date is invalid");
    if (props.startDate.getTime() <= Date.now())
      throw new Error("Start date must be in the future");
    if (!Number.isInteger(props.capacity) || props.capacity < 1)
      throw new Error("Capacity must be at least 1");
    if (props.price !== undefined && props.price < 0)
      throw new Error("Price must be non-negative");
    if (!props.organizerId || props.organizerId.trim() === "")
      throw new Error("Organizer is required");
    if (!props.categoryId || props.categoryId.trim() === "")
      throw new Error("Category is required");

    this.id = props.id;
    this.title = props.title.trim();
    this.description = props.description;
    this.startDate = props.startDate;
    this.venueId = props.venueId;
    this.capacity = props.capacity;
    this.price = props.price;
    this.organizerId = props.organizerId;
    this.categoryId = props.categoryId;
    this.imageUrl = props.imageUrl;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }
}
