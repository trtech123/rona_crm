import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Service Role Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Retrieve the expected API key from environment variables
const expectedApiKey = process.env.MAKE_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('API Route Error (post-comments): Supabase URL or Service Role Key missing.');
}
if (!expectedApiKey) {
  console.error('API Route Error (post-comments): MAKE_API_KEY is not set. Endpoint will be inaccessible.');
}

// Create client only if config is present
const supabase = (supabaseUrl && supabaseServiceKey) ? createClient(supabaseUrl, supabaseServiceKey) : null;

interface CommentWebhookPayload {
  platform_post_id: string;
  comments: string[]; // Assuming an array of comment texts for simplicity
  // Alternatively, could be an array of objects: { text: string; author?: string; platform_id?: string; ... }
}

/**
 * API endpoint for Make.com to send post comments.
 * Requires API Key authentication.
 * Finds the internal post ID based on platform_post_id and inserts comments.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log(`[${new Date(startTime).toISOString()}] Post Comments API: Received POST request.`);

  // --- API Key Authentication ---
  const providedApiKey = request.headers.get('x-api-key');
  if (!expectedApiKey) {
      console.error(`[${new Date().toISOString()}] Post Comments API: Server Configuration Error - MAKE_API_KEY not set.`);
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
  }
  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    console.warn(`[${new Date().toISOString()}] Post Comments API: Unauthorized attempt. Provided Key: ${providedApiKey ? '[REDACTED]' : 'None'}`);
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  console.log(`[${new Date().toISOString()}] Post Comments API: API Key authenticated.`);

  // --- Supabase Client Check ---
  if (!supabase) {
    console.error(`[${new Date().toISOString()}] Post Comments API: Error - Supabase client not initialized.`);
    return NextResponse.json(
        { success: false, message: 'Server configuration error: Supabase client not initialized.' }, 
        { status: 500 }
    );
  }

  // --- Process Request Body ---  
  try {
    const payload: CommentWebhookPayload = await request.json();
    console.log(`[${new Date().toISOString()}] Post Comments API: Received Payload:`, JSON.stringify(payload, null, 2));

    const { platform_post_id, comments } = payload;

    // Validate payload
    if (!platform_post_id || !comments || !Array.isArray(comments) || comments.length === 0) {
      console.warn(`[${new Date().toISOString()}] Post Comments API: Invalid payload received. platform_post_id: ${platform_post_id}, comments type: ${typeof comments}, isArray: ${Array.isArray(comments)}, length: ${comments?.length}`);
      return NextResponse.json(
        { success: false, message: 'Invalid payload: requires platform_post_id and a non-empty comments array.' }, 
        { status: 400 }
      );
    }

    // --- Find Internal Post ID --- 
    console.log(`[${new Date().toISOString()}] Post Comments API: Searching for internal post ID matching platform_post_id: ${platform_post_id}`);
    const { data: postData, error: postFetchError } = await supabase
      .from('posts')
      .select('id') // Select internal UUID
      .eq('post_id', platform_post_id) // Match using the platform's post ID
      .maybeSingle(); // Use maybeSingle as it might not exist

    if (postFetchError) {
      console.error(`[${new Date().toISOString()}] Post Comments API: Error fetching post by platform_post_id ${platform_post_id}:`, postFetchError);
      throw postFetchError; // Let the main catch block handle it
    }

    if (!postData) {
      console.warn(`[${new Date().toISOString()}] Post Comments API: Post not found for platform_post_id: ${platform_post_id}. Cannot add comments.`);
      return NextResponse.json(
        { success: false, message: `Post not found for platform_post_id: ${platform_post_id}` }, 
        { status: 404 } // Not Found
      );
    }

    const internalPostId = postData.id;
    console.log(`[${new Date().toISOString()}] Post Comments API: Found internal post ID: ${internalPostId} for platform_post_id: ${platform_post_id}`);

    // --- Insert Comments ---    
    // Prepare comments for insertion (adapt if comments are objects with more fields)
    const commentsToInsert = comments.map(commentText => ({
      post_id: internalPostId, // Link to our internal post UUID
      comment_text: commentText,
      // Add other fields here if available in payload, e.g.:
      // platform_comment_id: comment.platform_id,
      // author_name: comment.author,
    }));

    console.log(`[${new Date().toISOString()}] Post Comments API: Attempting to insert ${commentsToInsert.length} comments for internal post ID: ${internalPostId}`);
    const { error: insertError } = await supabase
      .from('post_comments') // Target the comments table
      .insert(commentsToInsert);

    if (insertError) {
      console.error(`[${new Date().toISOString()}] Post Comments API: Error inserting comments for internal post ID ${internalPostId}:`, insertError);
      throw insertError; // Let the main catch block handle it
    }

    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] Post Comments API: Successfully inserted ${commentsToInsert.length} comments for internal post ID ${internalPostId} in ${duration}ms.`);
    return NextResponse.json({ success: true, message: `Successfully added ${commentsToInsert.length} comments.` });

  } catch (error) {
    const errorDuration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] --- Post Comments API: ERROR after ${errorDuration}ms ---`);
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