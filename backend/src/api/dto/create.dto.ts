export interface CreateEventDTO {
  title: string;
  description?: string;
  startDate: string;
  venueId: string;
  capacity: number;
  price?: number;
  categoryId: string;
  imageUrl?: string;
}
