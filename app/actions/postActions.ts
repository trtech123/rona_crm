'use server';

import { generatePost } from '@/lib/openai';
import type { PostFormData } from '@/types/post';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { AuthError, User } from '@supabase/supabase-js'; // Import User type
import { createServerActionClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Post } from '@/types/post'; // Ensure Post type is imported

/**
 * Server action to generate a social media post using OpenAI.
 * @param formData The data collected from the post creation form.
 * @returns An object indicating success or failure, potentially with the generated content or an error message.
 */
export async function createPostAction(formData: PostFormData): Promise<{
  success: boolean;
  message?: string;
}> {
  console.log('[Server Action] createPostAction called with formData:', formData.postType);

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try { cookieStore.set({ name, value, ...options }); } catch (e) {}
        },
        remove(name: string, options: any) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (e) {}
        },
      },
    }
  );

  try {
    await generatePost(formData, supabase);

    console.log('[Server Action] Post generated and saved successfully by generatePost.');

    return {
      success: true,
      message: 'Post generated and saved successfully!',
    };
  } catch (error: any) {
    console.error('[Server Action] Error in createPostAction calling generatePost:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while generating the post.',
    };
  }
} 

// New Server Action to save post directly
export async function saveDirectPostAction(formData: PostFormData): Promise<{ 
  success: boolean; 
  message?: string; 
}> {
  console.log('[Server Action] saveDirectPostAction called...');
  const cookieStore = await cookies(); // Await cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { // Restore the full cookies object
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  try {
    // Get user directly within the action
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[saveDirectPostAction] Error getting user:', userError);
      return { success: false, message: "User not authenticated." };
    }

    // 1. Save input data to posts_inputs (ensure all fields are mapped)
    const postInput = {
      post_type: formData.postType,
      post_problem: formData.postProblem,
      custom_post_problem: formData.customPostProblem,
      social_network: formData.socialNetwork,
      content_goal: formData.contentGoal,
      target_audience: formData.targetAudience,
      has_specific_property: formData.hasSpecificProperty === "yes",
      use_external_articles: formData.useExternalArticles === "yes",
      external_article_link: formData.externalArticleLink,
      include_cta: formData.includeCTA === "yes",
      cta_type: formData.ctaType,
      cta_text: formData.ctaText,
      cta_link: formData.ctaLink,
      cta_phone: formData.ctaPhone,
      cta_whatsapp_message: formData.ctaWhatsappMessage,
      media_type: formData.mediaType,
      images: formData.images,
      video_file: formData.videoFile,
      video_link: formData.videoLink,
      // Add any other fields from PostFormData that map to posts_inputs
      author_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    console.log('[saveDirectPostAction] Saving to posts_inputs:', postInput);
    const { data: inputData, error: insertError } = await supabase
      .from("posts_inputs")
      .insert([postInput])
      .select('id'); // Select the ID of the inserted input record

    if (insertError) {
      console.error("[saveDirectPostAction] Supabase posts_inputs insert error:", insertError);
      throw new Error(`Failed to save post inputs: ${insertError.message}`);
    }
    const postInputId = inputData?.[0]?.id;
    console.log('[saveDirectPostAction] Saved to posts_inputs with ID:', postInputId);

    // 2. Save the main content to the posts table
    const mainContent = formData.content || formData.contentGoal || ''; // Use content or contentGoal
    if (!mainContent) {
        console.warn("[saveDirectPostAction] No main content found in formData.content or formData.contentGoal. Saving post with empty content.");
    }
    
    const postData = {
        user_id: user.id,
        content: mainContent,
        platform: formData.socialNetwork,
        // Example: link to the input data
        post_input_id: postInputId, // Assuming you have a column named post_input_id in 'posts' table
        // Add other relevant fields like hashtags if available/desired
        // hashtags: [], 
        created_at: new Date().toISOString(),
    };
    console.log('[saveDirectPostAction] Saving to posts:', postData);
    const { error: postInsertError } = await supabase
      .from("posts")
      .insert([postData]);
    
    if (postInsertError) {
      console.error("[saveDirectPostAction] Supabase posts insert error:", postInsertError);
      // Optionally: attempt to delete the posts_inputs entry if post fails?
      throw new Error(`Failed to save post: ${postInsertError.message}`);
    }

    console.log('[Server Action] Post saved directly successfully.');
    return { 
      success: true, 
      message: 'Post saved successfully!' 
    };

  } catch (error: any) {
    console.error('[Server Action] Error in saveDirectPostAction:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred while saving the post.',
    };
  }
} 

export async function deletePostAction(postId: string) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
       cookies: { // Restore the full cookies object
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
    // Optionally redirect to login or show an error
    redirect('/signin?message=Authentication required');
    return; // Stop execution
  }

  console.log(`[Action] Attempting to delete post ${postId} by user ${user.id}`);

  // Delete the post, ensuring it belongs to the user
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .match({ id: postId, user_id: user.id }); // Match both ID and user ID

  if (deleteError) {
    console.error("Error deleting post:", deleteError);
    // How to handle this? Maybe redirect with an error message?
    redirect(`/posts/${postId}?error=Failed to delete post`); // Redirect back to post page with error
    return;
  }

  console.log(`[Action] Post ${postId} deleted successfully by user ${user.id}`);

  // Revalidate relevant paths
  revalidatePath('/posts'); // The main posts list
  revalidatePath(`/posts/${postId}`); // The specific post page (though it's deleted)
  revalidatePath('/dashboard/articles'); // Add revalidation for the dashboard page

  // Redirect to the main posts list page after deletion
  redirect('/posts?message=Post deleted successfully');
} 

// Server action to update post content
export async function updatePostAction(
  postId: string,
  newContent: string
): Promise<{ success: boolean; message?: string; updatedPost?: Post }> {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
       cookies: { // Restore the full cookies object
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: any) { try { cookieStore.set({ name, value, ...options }); } catch (e) {} },
        remove(name: string, options: any) { try { cookieStore.set({ name, value: '', ...options }); } catch (e) {} },
      },
    }
  );

  // Get user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("[updatePostAction] Error getting user or user not logged in:", userError);
    return { success: false, message: "Authentication required" };
  }

  console.log(`[Action] Attempting to update post ${postId} by user ${user.id}`);

  // Update the post content, ensuring it belongs to the user
  const { data: updatedData, error: updateError } = await supabase
    .from('posts')
    .update({
        content: newContent
    })
    .match({ id: postId, user_id: user.id }) // Match both ID and user ID
    .select() // Select the updated row
    .single(); // Expect a single row

  if (updateError) {
    console.error("[updatePostAction] Error updating post:", updateError);
    return { success: false, message: `Failed to update post: ${updateError.message}` };
  }

  if (!updatedData) {
      console.error("[updatePostAction] Post not found or update failed for post:", postId);
      return { success: false, message: "Post not found or update failed." };
  }

  console.log(`[Action] Post ${postId} updated successfully by user ${user.id}`);

  // Revalidate the specific post page and the list page
  revalidatePath(`/posts/${postId}`);
  revalidatePath('/posts');

  // Redirect back to the post detail page after successful update
  // Optional: Could return success and handle redirect in the client component
  redirect(`/posts/${postId}?message=Post updated successfully`);

  // Note: Redirect stops execution, so this return is technically unreachable
  // but good practice for typing if redirect wasn't used.
  // return { success: true, message: 'Post updated successfully', updatedPost: updatedData as Post };
} 

export async function publishPostAction(postId: string): Promise<{ success: boolean; message?: string }> {
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
    // Update the post's published status and published_at timestamp
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .match({ id: postId, user_id: user.id });

    if (updateError) {
      console.error("Error publishing post:", updateError);
      return { success: false, message: "Failed to publish post" };
    }

    // Revalidate the posts page to show updated status
    revalidatePath('/dashboard/articles');
    
    return { success: true, message: "Post published successfully" };
  } catch (error: any) {
    console.error("Error in publishPostAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
} 

export async function publishToAyrshareAction(postId: string): Promise<{ success: boolean; message?: string }> {
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
    // First, get the post content
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*')
      .match({ id: postId, user_id: user.id })
      .single();

    if (postError || !post) {
      console.error("Error fetching post:", postError);
      return { success: false, message: "Post not found" };
    }

    // Prepare the Ayrshare API request
    const ayrshareResponse = await fetch("https://api.ayrshare.com/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AYRSHARE_API_KEY}`
      },
      body: JSON.stringify({
        post: post.content,
        platforms: ["facebook"], // We're only publishing to Facebook for now
        mediaUrls: post.images || [] // Include any images if they exist
      }),
    });

    if (!ayrshareResponse.ok) {
      const errorData = await ayrshareResponse.json();
      console.error("Ayrshare API error:", errorData);
      return { success: false, message: "Failed to publish to social media" };
    }

    const ayrshareData = await ayrshareResponse.json();
    
    // Extract the Facebook post URL from the Ayrshare response
    // The URL format might be in the response data, adjust as needed based on Ayrshare's API response
    const facebookPostUrl = ayrshareData.facebook?.url || ayrshareData.postUrl || null;
    
    if (!facebookPostUrl) {
      console.error("No Facebook post URL found in Ayrshare response:", ayrshareData);
      return { success: false, message: "Failed to get Facebook post URL" };
    }

    // Update the post's published status and published_at timestamp
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        published: true,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        facebook_post_url: facebookPostUrl // Store the Facebook post URL
      })
      .match({ id: postId, user_id: user.id });

    if (updateError) {
      console.error("Error updating post status:", updateError);
      return { success: false, message: "Failed to update post status" };
    }

    // Revalidate the posts page to show updated status
    revalidatePath('/dashboard/articles');
    
    return { success: true, message: "Post published to Facebook successfully" };
  } catch (error: any) {
    console.error("Error in publishToAyrshareAction:", error);
    return { success: false, message: error.message || "An unexpected error occurred" };
  }
} 