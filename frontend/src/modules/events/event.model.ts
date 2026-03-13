export interface Event {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  venueId: string;
  capacity: number;
  price?: number | null;
  organizerId: string;
  categoryId: string;
  imageUrl?: string | null;
}
