'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { Comment, CommentFormData, CommentUpdateData } from '@/types/comment';

/**
 * Server action to create a new comment
 */
export async function createCommentAction(formData: CommentFormData): Promise<{
  success: boolean;
  message?: string;
  comment?: Comment;
}> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user or user not logged in:", userError);
    return { success: false, message: "Authentication required" };
  }

  try {
    // Set the user_id if not provided
    const commentData = {
      ...formData,
      user_id: formData.user_id || user.id,
    };

    // Insert the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();

    if (error) {
      console.error("Error creating comment:", error);
      return { success: false, message: "Failed to create comment" };
    }

    // Revalidate the posts page to show updated comments
    revalidatePath('/dashboard/articles');
    
    return { 
      success: true, 
      message: "Comment created successfully",
      comment: data as Comment
    };
  } catch (error: any) {
    console.error("Error in createCommentAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server action to update an existing comment
 */
export async function updateCommentAction(
  commentId: string,
  updateData: CommentUpdateData
): Promise<{ success: boolean; message?: string; comment?: Comment }> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user or user not logged in:", userError);
    return { success: false, message: "Authentication required" };
  }

  try {
    // Update the comment
    const { data, error } = await supabase
      .from('comments')
      .update(updateData)
      .eq('id', commentId)
      .eq('user_id', user.id) // Ensure the user owns the comment
      .select()
      .single();

    if (error) {
      console.error("Error updating comment:", error);
      return { success: false, message: "Failed to update comment" };
    }

    // Revalidate the posts page to show updated comments
    revalidatePath('/dashboard/articles');
    
    return { 
      success: true, 
      message: "Comment updated successfully",
      comment: data as Comment
    };
  } catch (error: any) {
    console.error("Error in updateCommentAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server action to delete a comment
 */
export async function deleteCommentAction(commentId: string): Promise<{ success: boolean; message?: string }> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error getting user or user not logged in:", userError);
    return { success: false, message: "Authentication required" };
  }

  try {
    // Delete the comment
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id); // Ensure the user owns the comment

    if (error) {
      console.error("Error deleting comment:", error);
      return { success: false, message: "Failed to delete comment" };
    }

    // Revalidate the posts page to show updated comments
    revalidatePath('/dashboard/articles');
    
    return { success: true, message: "Comment deleted successfully" };
  } catch (error: any) {
    console.error("Error in deleteCommentAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
}

/**
 * Server action to save a comment from Make.com
 * This is used by the webhook endpoint to save comments from external sources
 */
export async function saveCommentFromMakeAction(
  postId: string,
  content: string,
  source: string = 'make',
  metadata?: Record<string, any>
): Promise<{ success: boolean; message?: string; comment?: Comment }> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  try {
    // Create the comment data
    const commentData: CommentFormData = {
      post_id: postId,
      content,
      source,
      metadata,
    };

    // Insert the comment
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();

    if (error) {
      console.error("Error saving comment from Make.com:", error);
      return { success: false, message: "Failed to save comment from Make.com" };
    }

    // Revalidate the posts page to show updated comments
    revalidatePath('/dashboard/articles');
    
    return { 
      success: true, 
      message: "Comment from Make.com saved successfully",
      comment: data as Comment
    };
  } catch (error: any) {
    console.error("Error in saveCommentFromMakeAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
} 