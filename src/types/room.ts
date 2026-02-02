export interface RoomImage {
  id: string;
  url: string;
  file?: File;
  width: number;
  height: number;
}

export type RoomType =
  | 'livingroom'
  | 'bedroom'
  | 'diningroom'
  | 'office'
  | 'kitchen';

export type DesignStyle =
  | 'modern'
  | 'minimalist'
  | 'scandinavian'
  | 'industrial'
  | 'traditional'
  | 'bohemian';

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  livingroom: 'Living Room',
  bedroom: 'Bedroom',
  diningroom: 'Dining Room',
  office: 'Office',
  kitchen: 'Kitchen',
};

export const DESIGN_STYLE_LABELS: Record<DesignStyle, string> = {
  modern: 'Modern',
  minimalist: 'Minimalist',
  scandinavian: 'Scandinavian',
  industrial: 'Industrial',
  traditional: 'Traditional',
  bohemian: 'Bohemian',
};
