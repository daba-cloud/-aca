export type PostType = 'video' | 'image_card' | 'fullscreen_card';

export interface AuthorInfo {
  name: string;
  handle?: string;
  avatarLetter: string;
  avatarColor?: string;
  verified?: boolean;
}

export interface PostItem {
  id: string;
  type: PostType;
  title: string;
  subtitle: string;
  excerpt: string;
  timeAgo: string;
  author: AuthorInfo;
  videoUrl?: string;
  youtubeId?: string;
  imageUrl?: string;
  fromText?: string;
  cardHeight?: number;
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  sharesCount?: number;
  viewsCount?: string;
}

export type CategoryFilter = 
  | 'sve' 
  | 'video' 
  | 'slikovne' 
  | 'ekskluzivno' 
  | 'analiza' 
  | 'izveštaj'
  | 'rts'
  | 'n1';

export type GeneratorMode = 'cinematic_card' | 'fullscreen_blur';

export interface GeneratorFormState {
  title: string;
  subtitle: string;
  text: string;
  fromText: string;
  image: string | null;
  cardHeight: number;
  mode: GeneratorMode;
  aspectRatio: 'standard' | 'story' | 'square';
  glowIntensity: number;
  showTaggedWatermark: boolean;
  authorName: string;
}
