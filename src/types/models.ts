// types/models.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_link?: string;
  order: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArtistSocialLinks {
  instagram?: string;
  spotify?: string;
  youtube?: string;
  twitter?: string;
  bandcamp?: string;
  [key: string]: string | undefined;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio: string;
  photo_url: string;
  genre: string | string[];
  social_links?: ArtistSocialLinks | null;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface ReleaseStreamingLinks {
  spotify?: string;
  apple_music?: string;
  bandcamp?: string;
  youtube_music?: string;
  deezer?: string;
  soundcloud?: string;
  [key: string]: string | undefined;
}

export interface Release {
  id: string;
  artist_id: string;
  artist?: Artist;
  title: string;
  slug: string;
  release_year: number;
  format: string | string[];
  artwork_url: string;
  description: string;
  streaming_links?: ReleaseStreamingLinks | null;
  status: "published" | "draft";
  created_at?: string;
  updated_at?: string;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image_url: string;
  author?: string;
  related_artist_id?: string | null;
  related_release_id?: string | null;
  status: "draft" | "published";
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LiveEvent {
  id: string;
  artist_id?: string;
  artist?: Artist;
  event_date: string;
  city: string;
  venue: string;
  country: string;
  ticket_url: string;
  status: "upcoming" | "past" | "cancelled";
  created_at?: string;
  updated_at?: string;
}
