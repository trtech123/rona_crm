import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// NOTE: API Key environment variable and check removed as requested.

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('API Route Error (post-comments): Supabase URL or Service Role Key missing.');
}

// Create client only if config is present
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Define the structure for the nested "from" object
interface CommentFrom {
  name: string;
  id: string; // Platform-specific user ID
}

// Define the structure for a single comment coming in the payload
interface InputComment {
  from: CommentFrom;
  message: string; // Changed from 'text'
}

interface CommentWebhookPayload {
  platform_post_id: string;
  comments: InputComment[]; // Array of the updated comment objects
}

/**
 * Public API endpoint for Make.com (or other services) to send post comments.
 * NOTE: This endpoint is publicly accessible.
 * Finds the internal post ID based on platform_post_id and inserts comments.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[${new Date(startTime).toISOString()}] Public Post Comments API: Received POST request.`);

  // --- Removed API Key Authentication ---

  // --- Supabase Client Check ---
  if (!supabase) {
    console.error(`[${new Date().toISOString()}] Public Post Comments API: Error - Supabase client not initialized.`);
    return NextResponse.json(
        { success: false, message: 'Server configuration error: Supabase client not initialized.' }, 
        { status: 500 }
    );
  }

  // --- Process Request Body ---  
  try {
    const payload: CommentWebhookPayload = await request.json();
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Received Payload:`, JSON.stringify(payload, null, 2));

    const { platform_post_id, comments } = payload;

    // Validate payload
    if (
      !platform_post_id || 
      !comments || 
      !Array.isArray(comments) || 
      comments.length === 0 ||
      // Check if every comment object has the required nested structure and fields
      !comments.every(c => 
        c && 
        c.from && 
        typeof c.from.name === 'string' && 
        typeof c.from.id === 'string' && // Also validate the platform ID
        typeof c.message === 'string'
      ) 
    ) {
      console.warn(`[${new Date().toISOString()}] Public Post Comments API: Invalid payload structure received. platform_post_id: ${platform_post_id}`, JSON.stringify(payload, null, 2));
      // Add more specific validation logging if needed
      return NextResponse.json(
        { success: false, message: 'Invalid payload: requires platform_post_id and a non-empty comments array, where each comment has from.name (string), from.id (string), and message (string).' }, 
        { status: 400 }
      );
    }

    // --- Find Internal Post ID --- 
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Searching for internal post ID matching platform_post_id: ${platform_post_id}`);
    const { data: postData, error: postFetchError } = await supabase
      .from('posts')
      .select('id') // Select internal UUID
      .eq('post_id', platform_post_id) // Match using the platform's post ID
      .maybeSingle(); // Use maybeSingle as it might not exist

    if (postFetchError) {
      console.error(`[${new Date().toISOString()}] Public Post Comments API: Error fetching post by platform_post_id ${platform_post_id}:`, postFetchError);
      throw postFetchError;
    }

    if (!postData) {
      console.warn(`[${new Date().toISOString()}] Public Post Comments API: Post not found for platform_post_id: ${platform_post_id}. Cannot add comments.`);
      return NextResponse.json(
        { success: false, message: `Post not found for platform_post_id: ${platform_post_id}` }, 
        { status: 404 } // Not Found
      );
    }

    const internalPostId = postData.id;
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Found internal post ID: ${internalPostId} for platform_post_id: ${platform_post_id}`);

    // --- Prepare Comments for Insertion ---    
    const commentsToInsert = comments.map(comment => ({
      post_id: internalPostId,       // Link to our internal post UUID (matches schema if posts.id is UUID)
      content: comment.message,      // Corrected: Map to 'content' column
      lead_name: comment.from.name,  // Get name from nested 'from.name' (matches schema)
      external_id: comment.from.id   // Corrected: Map platform user ID to 'external_id' column
      // Add other fields here if needed, like 'source' or defaults for other columns
    }));

    console.log(`[${new Date().toISOString()}] Public Post Comments API: Attempting to insert ${commentsToInsert.length} comments for internal post ID: ${internalPostId}`);
    const { data: insertedComments, error: insertError } = await supabase
      .from('comments') // Corrected: Target the comments table
      .insert(commentsToInsert);

    if (insertError) {
      console.error(`[${new Date().toISOString()}] Public Post Comments API: Error inserting comments for internal post ID ${internalPostId}:`, insertError);
      throw insertError;
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Public Post Comments API: Successfully inserted ${commentsToInsert.length} comments for internal post ID ${internalPostId} in ${duration}ms.`);
    return NextResponse.json({ success: true, message: `Successfully added ${commentsToInsert.length} comments.` });

  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] --- Public Post Comments API: ERROR after ${errorDuration}ms ---`);
    console.error('Caught Error Object:', error);
    if (error instanceof Error) {
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      if (error.stack) {
        console.error('Error Stack:', error.stack);
      }
    }
    try {
      console.error('Error Stringified:', JSON.stringify(error, null, 2));
    } catch (stringifyError) {
      console.error('Could not stringify the error object.');
    }
    console.error('--- END ERROR --- ');

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error processing comments webhook',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 