import { Post } from './post';
import { User } from '@supabase/supabase-js';

/**
 * Represents a comment in the system
 */
export interface Comment {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  source?: string;
  author_id?: string;
  author_name?: string;
  author_avatar_url?: string;
  external_id?: string;
  updated_at: string;
  user_id?: string;
  is_processed: boolean;
  metadata?: Record<string, any>;
  
  // Relations (populated when joined)
  post?: Post;
  user?: User;
}

/**
 * Type for creating a new comment
 */
export interface CommentFormData {
  post_id: string;
  content: string;
  source?: string;
  external_id?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

/**
 * Type for updating an existing comment
 */
export interface CommentUpdateData {
  content?: string;
  is_processed?: boolean;
  metadata?: Record<string, any>;
} 