
export type Artist = {
  artist_id: string;
  id: string;
  user_id: string;
  name: string;
  bio: string;
  category: string;
  rate: string;
  phone: string;
  location: string;
  website?: string;
  banner_image?: string;
  profile_image?: string;
  featured: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export type Profile = {
  id: string;
  full_name: string;
  profile_image: string | null;
  is_artist: boolean;
  created_at: string;
  updated_at: string;
}

export type Booking = {
  id: string;
  client_id: string;
  artist_id: string;
  event_title: string;
  event_date: string;
  event_time?: string;
  location: string;
  description?: string;
  booking_purpose?: string;
  additional_requirements?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type ArtistReview = {
  id: string;
  artist_id: string;
  reviewer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export type ArtistPortfolioItem = {
  id: string;
  artist_id: string;
  title: string;
  description?: string;
  media_url: string;
  media_type: 'image' | 'video';
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export type Ad = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  position: string;
  pages: string[];
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export type UserMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type UserMessageWithNames = UserMessage & {
  sender_name: string;
  recipient_name: string;
}

export type UserConversation = {
  conversation_with_id: string;
  conversation_with_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  media_url?: string | null;
  media_type?: string | null;
  media_size?: number | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  conversation_id: string;
  user_id: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        }
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        }
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        }
      }
      conversations: {
        Row: {
          id: string;
          created_at: string;
        }
        Insert: {
          id?: string;
          created_at?: string;
        }
        Update: {
          id?: string;
          created_at?: string;
        }
      }
      conversation_participants: {
        Row: {
          conversation_id: string;
          user_id: string;
          created_at: string;
        }
        Insert: {
          conversation_id: string;
          user_id: string;
          created_at?: string;
        }
        Update: {
          conversation_id?: string;
          user_id?: string;
          created_at?: string;
        }
      }
    }
  }
}

export type JobListing = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  event_date: string;
  event_time?: string;
  location: string;
  budget_range?: string;
  requirements?: string;
  category: string;
  status: 'open' | 'in_progress' | 'filled' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type JobApplication = {
  id: string;
  job_id: string;
  artist_id: string;
  message: string;
  proposed_rate?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export type ResourceCategory = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type LearningResource = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  category_id: string | null;
  author_id: string;
  featured_image: string | null;
  status: 'draft' | 'published' | 'archived';
  tags: string[] | null;
  estimated_read_time: number | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
  created_at: string;
  updated_at: string;
}

export type ResourceMedia = {
  id: string;
  resource_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  caption: string | null;
  alt_text: string | null;
  file_size: number | null;
  created_at: string;
}
